import { AppError } from '../utils/AppError.js';

export class EntregaService {
    /**
     * @param {import('../repositories/entregas.repository.js').IEntregasRepository} entregasRepository
     * @param {import('../repositories/motoristas.repository.js').IMotoristasRepository} motoristasRepository
     */
    constructor(entregasRepository, motoristasRepository) {
        this.repository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

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

    async listarTodos({ status } = {}) {
        return this.repository.listarTodos({ status });
    };

    async buscarPorId(id) {
        const entrega = await this.repository.buscarPorId(Number(id));
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
        return entrega;
    }

    async avancarEntrega(id) {
        const entrega = await this.buscarPorId(id);
        const statusAtual = entrega.status;
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

    async atribuirEntrega(id, motoristaId) {
        const entrega = await this.buscarPorId(id);
        const motorista = await this.motoristasRepository.buscarPorId(Number(motoristaId));
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }

        if (entrega.status !== 'CRIADA') {
            throw new AppError('Entrega não pode ser atribuída', 422);
        }

        return this.repository.atualizar(entrega.id, {
            motoristaId: motorista.id,
            historico: [...entrega.historico, { ...this.#evento('ATRIBUIDA'), motoristaId: motorista.id }]
        });
    }

    #evento(status) {
        return { data: new Date().toISOString(), status };
    }
}
