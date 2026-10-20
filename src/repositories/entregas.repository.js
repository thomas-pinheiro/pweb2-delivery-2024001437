/**
 * @typedef {'CRIADA' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADA'} StatusEntrega
 */

/**
 * @typedef {Object} EventoHistorico
 * @property {string} data        Data/hora ISO 8601 do evento.
 * @property {string} status      Status (ou evento) registrado.
 * @property {number} [motoristaId] Motorista envolvido, quando o evento é uma atribuição.
 */

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {StatusEntrega} status
 * @property {number | null} motoristaId
 * @property {EventoHistorico[]} historico
 */

/**
 * @typedef {Object} FiltrosEntrega
 * @property {StatusEntrega} [status]  Retorna só entregas com este status.
 * @property {number} [motoristaId]    Retorna só entregas atribuídas a este motorista.
 */

/**
 * Contrato do repository de Entregas. Os services dependem APENAS destes métodos;
 * qualquer implementação (memória, banco, Mock) que os respeite pode ser injetada.
 *
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: FiltrosEntrega) => Promise<Entrega[]>} listarTodos
 *   Lista as entregas, aplicando os filtros informados (combináveis).
 * @property {(id: number) => Promise<Entrega | null>} buscarPorId
 *   Busca uma entrega pelo id; `null` se não existir.
 * @property {(dados: { descricao: string, origem: string, destino: string }) => Promise<Entrega>} criar
 *   Persiste uma nova entrega (status `CRIADA`, sem motorista, evento inicial no histórico).
 * @property {(id: number, dados: Partial<Omit<Entrega, 'id'>>) => Promise<Entrega>} atualizar
 *   Atualiza os campos informados de uma entrega existente e a retorna.
 */

/**
 * Implementação em memória de {@link IEntregasRepository}.
 * @implements {IEntregasRepository}
 */
export class EntregaRepository {
    /** @param {import('../database/database.js').Database} database */
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
