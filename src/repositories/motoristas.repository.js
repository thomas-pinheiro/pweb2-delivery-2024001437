/**
 * @typedef {'ATIVO' | 'INATIVO'} StatusMotorista
 */

/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf            Único entre os motoristas.
 * @property {string} [placaVeiculo]
 * @property {StatusMotorista} status
 */

/**
 * Contrato do repository de Motoristas. Os services dependem APENAS destes métodos;
 * qualquer implementação (memória, banco, Mock) que os respeite pode ser injetada.
 *
 * @typedef {Object} IMotoristasRepository
 * @property {() => Promise<Motorista[]>} listarTodos
 *   Lista todos os motoristas.
 * @property {(id: number) => Promise<Motorista | null>} buscarPorId
 *   Busca um motorista pelo id; `null` se não existir.
 * @property {(cpf: string) => Promise<Motorista | null>} buscarPorCpf
 *   Busca um motorista pelo CPF; `null` se não existir.
 * @property {(dados: { nome: string, cpf: string, placaVeiculo?: string }) => Promise<Motorista>} criar
 *   Persiste um novo motorista com status `ATIVO`.
 */

/**
 * Implementação em memória de {@link IMotoristasRepository}.
 * @implements {IMotoristasRepository}
 */
export class MotoristaRepository {
    /** @param {import('../database/database.js').Database} database */
    constructor(database) {
        this.database = database;
    }

    async listarTodos() {
        return this.database.motoristas;
    }

    async buscarPorId(id) {
        return this.database.motoristas.find((m) => m.id === id) ?? null;
    }

    async buscarPorCpf(cpf) {
        return this.database.motoristas.find((m) => m.cpf === cpf) ?? null;
    }

    async criar({ nome, cpf, placaVeiculo }) {
        const novo = {
            id: this.database.proximoId('motoristas'),
            nome,
            cpf,
            placaVeiculo,
            status: 'ATIVO',
        };
        this.database.motoristas.push(novo);
        return novo;
    }
}
