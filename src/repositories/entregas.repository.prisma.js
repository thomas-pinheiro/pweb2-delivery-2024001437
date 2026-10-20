/** @import { IEntregasRepository, Entrega } from './contratos/IEntregasRepository.js' */
import { prisma } from '../config/database.js';

// O Prisma não carrega relações por padrão: toda consulta precisa incluir o histórico.
const INCLUIR_HISTORICO = /** @type {const} */ ({ historico: { orderBy: { id: 'asc' } } });

/**
 * Converte o registro do Prisma para o formato do contrato: eventos sem `id`/`entregaId`
 * e com `data` em ISO 8601, como na implementação em memória.
 * @returns {Entrega | null}
 */
function paraEntrega(registro) {
    if (!registro) return null;
    return {
        ...registro,
        historico: registro.historico.map((e) => ({
            data: e.data.toISOString(),
            status: e.status,
            ...(e.motoristaId !== null && { motoristaId: e.motoristaId }),
        })),
    };
}

/**
 * Implementação Prisma (SQLite) de {@link IEntregasRepository}.
 * @implements {IEntregasRepository}
 */
export class EntregasRepositoryPrisma {
    async listarTodos(filtros = {}) {
        const { status, motoristaId } = filtros;
        const registros = await prisma.entrega.findMany({
            where: { status, motoristaId },
            orderBy: { id: 'asc' },
            include: INCLUIR_HISTORICO,
        });
        return registros.map(paraEntrega);
    }

    async buscarPorId(id) {
        if (!Number.isInteger(id)) return null;
        const registro = await prisma.entrega.findUnique({
            where: { id },
            include: INCLUIR_HISTORICO,
        });
        return paraEntrega(registro);
    }

    async criar({ descricao, origem, destino }) {
        const registro = await prisma.entrega.create({
            data: {
                descricao,
                origem,
                destino,
                historico: { create: [{ status: 'CRIADA' }] },
            },
            include: INCLUIR_HISTORICO,
        });
        return paraEntrega(registro);
    }

    async atualizar(id, dados) {
        // `historico` não é coluna: o service envia a lista completa, e ela substitui os eventos atuais. Tudo num único update, que o Prisma executa em transação.
        const { historico, ...campos } = dados;
        const registro = await prisma.entrega.update({
            where: { id },
            data: {
                ...campos,
                ...(historico && {
                    historico: {
                        deleteMany: {},
                        create: historico.map((e) => ({
                            data: new Date(e.data),
                            status: e.status,
                            motoristaId: e.motoristaId ?? null,
                        })),
                    },
                }),
            },
            include: INCLUIR_HISTORICO,
        });
        return paraEntrega(registro);
    }
}
