/** @import { IMotoristasRepository } from './contratos/IMotoristasRepository.js' */
import { prisma } from '../config/database.js';

/**
 * Implementação Prisma (SQLite) de {@link IMotoristasRepository}.
 * @implements {IMotoristasRepository}
 */
export class MotoristasRepositoryPrisma {
    async listarTodos() {
        return prisma.motorista.findMany({ orderBy: { id: 'asc' } });
    }

    async buscarPorId(id) {
        if (!Number.isInteger(id)) return null;
        return prisma.motorista.findUnique({ where: { id } });
    }

    async buscarPorCpf(cpf) {
        return prisma.motorista.findUnique({ where: { cpf } });
    }

    async criar({ nome, cpf, placaVeiculo }) {
        return prisma.motorista.create({ data: { nome, cpf, placaVeiculo } });
    }
}
