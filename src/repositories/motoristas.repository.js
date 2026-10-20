/** @import { IMotoristasRepository, Motorista } from './contratos/IMotoristasRepository.js' */
/** @import { Database } from '../database/database.js' */

/**
 * Implementação em memória de {@link IMotoristasRepository}.
 * @implements {IMotoristasRepository}
 */
export class MotoristaRepository {
    /** @param {Database} database */
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
        /** @type {Motorista} */
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
