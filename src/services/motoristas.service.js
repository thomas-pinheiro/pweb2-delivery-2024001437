import { AppError } from '../utils/AppError.js';

/** @typedef {import('../repositories/contratos/IMotoristasRepository.js').IMotoristasRepository} IMotoristasRepository */
/** @typedef {import('../repositories/contratos/IMotoristasRepository.js').Motorista} Motorista */
/** @typedef {import('../repositories/contratos/IEntregasRepository.js').IEntregasRepository} IEntregasRepository */
/** @typedef {import('../repositories/contratos/IEntregasRepository.js').Entrega} Entrega */
/** @typedef {import('../repositories/contratos/IEntregasRepository.js').FiltrosEntrega} FiltrosEntrega */

/**
 * Regras de negócio de Motoristas: cadastro, consulta e entregas atribuídas.
 */
export class MotoristaService {
    /**
     * @param {IMotoristasRepository} motoristasRepository
     * @param {IEntregasRepository} entregasRepository Usado para listar as entregas de um motorista.
     */
    constructor(motoristasRepository, entregasRepository) {
        this.repository = motoristasRepository;
        this.entregasRepository = entregasRepository;
    }

    /**
     * Cadastra um motorista com status `ATIVO`.
     * @param {{ nome: string, cpf: string, placaVeiculo?: string }} dados
     * @returns {Promise<Motorista>}
     * @throws {AppError} 409 se o CPF já estiver cadastrado.
     */
    async criar({ nome, cpf, placaVeiculo }) {
        const motoristaExiste = await this.repository.buscarPorCpf(cpf);
        if (motoristaExiste) throw new AppError('Motorista com CPF já cadastrado', 409);

        return this.repository.criar({ nome, cpf, placaVeiculo });
    }

    /**
     * Lista todos os motoristas.
     * @returns {Promise<Motorista[]>}
     */
    async listarTodos() {
        return this.repository.listarTodos();
    }

    /**
     * Busca um motorista pelo id.
     * @param {number | string} id
     * @returns {Promise<Motorista>}
     * @throws {AppError} 404 se o motorista não existir.
     */
    async buscarPorId(id) {
        const motorista = await this.repository.buscarPorId(Number(id));
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }
        return motorista;
    }

    /**
     * Lista as entregas atribuídas ao motorista, opcionalmente filtradas por status.
     * @param {number | string} id Id do motorista.
     * @param {Pick<FiltrosEntrega, 'status'>} [filtros]
     * @returns {Promise<Entrega[]>}
     * @throws {AppError} 404 se o motorista não existir.
     */
    async listarEntregas(id, { status } = {}) {
        const motorista = await this.buscarPorId(id);
        return this.entregasRepository.listarTodos({ motoristaId: motorista.id, status });
    }
}
