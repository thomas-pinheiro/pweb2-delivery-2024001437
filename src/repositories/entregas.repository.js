/** @import { IEntregasRepository, Entrega } from './contratos/IEntregasRepository.js' */
/** @import { Database } from '../database/database.js' */

/**
 * Implementação em memória de {@link IEntregasRepository}.
 * @implements {IEntregasRepository}
 */
export class EntregaRepository {
    /** @param {Database} database */
    constructor(database) {
        this.database = database;
    }

    async listarTodos(filtros = {}) {
        const { status, motoristaId } = filtros;
        return this.database.entregas.filter((e) =>
            (status === undefined || e.status === status) &&
            (motoristaId === undefined || e.motoristaId === motoristaId)
        );
    }

    async buscarPorId(id) {
        return this.database.entregas.find((e) => e.id === id) ?? null;
    }

    async criar({ descricao, origem, destino }) {
        /** @type {Entrega} */
        const novo = {
            id: this.database.proximoId('entregas'),
            descricao,
            origem,
            destino,
            motoristaId: null,
            status: 'CRIADA',
            historico: [
                {
                    data: new Date().toISOString(),
                    status: 'CRIADA'
                }
            ]
        };
        this.database.entregas.push(novo);
        return novo;
    }

    async atualizar(id, dados) {
        const index = this.database.entregas.findIndex((e) => e.id === id);
        if (index === -1) {
            return null;
        }
        const atualizada = { ...this.database.entregas[index], ...dados, id };
        this.database.entregas[index] = atualizada;
        return atualizada;
    }
}
