import { AppError } from '../utils/AppError.js';

/** @import { IEntregasRepository, Entrega, StatusEntrega, FiltrosEntrega, EventoHistorico } from '../repositories/contratos/IEntregasRepository.js' */
/** @import { IMotoristasRepository } from '../repositories/contratos/IMotoristasRepository.js' */

/**
 * Regras de negócio de Entregas: criação, ciclo de status e atribuição a motorista.
 */
export class EntregaService {
    /**
     * @param {IEntregasRepository} entregasRepository
     * @param {IMotoristasRepository} motoristasRepository Usado para validar o motorista na atribuição.
     */
    constructor(entregasRepository, motoristasRepository) {
        this.repository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

    /**
     * Cria uma entrega com status `CRIADA`.
     * @param {{ descricao: string, origem: string, destino: string }} dados
     * @returns {Promise<Entrega>}
     * @throws {AppError} 400 se origem e destino forem iguais.
     * @throws {AppError} 409 se já existir entrega com a mesma descrição, origem e destino.
     */
    async criar({ descricao, origem, destino }) {
        if (origem === destino) throw new AppError('Origem e destino não podem ser iguais', 400);

        const entregas = await this.repository.listarTodos();
        const entregaExiste = entregas.some((e) =>
            e.descricao === descricao &&
            e.origem === origem &&
            e.destino === destino
        );
        if (entregaExiste) throw new AppError('Entrega já cadastrada', 409);

        return this.repository.criar({ descricao, origem, destino });
    }

    /**
     * Lista as entregas, opcionalmente filtradas por status.
     * @param {Pick<FiltrosEntrega, 'status'>} [filtros]
     * @returns {Promise<Entrega[]>}
     */
    async listarTodos({ status } = {}) {
        return this.repository.listarTodos({ status });
    };

    /**
     * Busca uma entrega pelo id.
     * @param {number | string} id
     * @returns {Promise<Entrega>}
     * @throws {AppError} 404 se a entrega não existir.
     */
    async buscarPorId(id) {
        const entrega = await this.repository.buscarPorId(Number(id));
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
        return entrega;
    }

    /**
     * Avança o status da entrega (`CRIADA → EM_TRANSITO → ENTREGUE`) e registra no histórico.
     * @param {number | string} id
     * @returns {Promise<Entrega>}
     * @throws {AppError} 404 se a entrega não existir.
     * @throws {AppError} 422 se a entrega já estiver `ENTREGUE` ou `CANCELADA`.
     */
    async avancarEntrega(id) {
        const entrega = await this.buscarPorId(id);
        const statusAtual = entrega.status;
        /** @type {StatusEntrega} */
        let novoStatus;
        switch (statusAtual) {
            case 'CRIADA':
                novoStatus = 'EM_TRANSITO';
                break;
            case 'EM_TRANSITO':
                novoStatus = 'ENTREGUE';
                break;
            default:
                throw new AppError('Transição inválida', 422);
        }

        return this.repository.atualizar(entrega.id, {
            status: novoStatus,
            historico: [...entrega.historico, this.#evento(novoStatus)]
        });
    }

    /**
     * Cancela a entrega e registra no histórico.
     * @param {number | string} id
     * @returns {Promise<Entrega>}
     * @throws {AppError} 404 se a entrega não existir.
     * @throws {AppError} 422 se a entrega já estiver `ENTREGUE` ou `CANCELADA`.
     */
    async cancelarEntrega(id) {
        const entrega = await this.buscarPorId(id);

        const statusAtual = entrega.status;
        if (statusAtual === 'ENTREGUE' || statusAtual === 'CANCELADA') {
            throw new AppError('Transição inválida', 422);
        }

        const novoStatus = 'CANCELADA';
        return this.repository.atualizar(entrega.id, {
            status: novoStatus,
            historico: [...entrega.historico, this.#evento(novoStatus)]
        });
    }

    /**
     * Atribui a entrega a um motorista e registra o evento `ATRIBUIDA` no histórico.
     * @param {number | string} id Id da entrega.
     * @param {number | string} motoristaId
     * @returns {Promise<Entrega>} A entrega com `motoristaId` preenchido.
     * @throws {AppError} 404 se a entrega ou o motorista não existirem.
     * @throws {AppError} 422 se a entrega não estiver `CRIADA` ou o motorista não estiver `ATIVO`.
     */
    async atribuirEntrega(id, motoristaId) {
        const entrega = await this.buscarPorId(id);
        const motorista = await this.motoristasRepository.buscarPorId(Number(motoristaId));
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }

        if (entrega.status !== 'CRIADA') {
            throw new AppError('Entrega não pode ser atribuída', 422);
        }

        if (motorista.status !== 'ATIVO') {
            throw new AppError('Motorista inativo não pode receber entregas', 422);
        }

        return this.repository.atualizar(entrega.id, {
            motoristaId: motorista.id,
            historico: [...entrega.historico, { ...this.#evento('ATRIBUIDA'), motoristaId: motorista.id }]
        });
    }

    /**
     * Monta um evento de histórico com a data atual.
     * @param {string} status
     * @returns {EventoHistorico}
     */
    #evento(status) {
        return { data: new Date().toISOString(), status };
    }
}
