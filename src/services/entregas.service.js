import { AppError } from '../utils/AppError.js';

export class EntregaService {
    constructor(repository, motoristaService) {
        this.repository = repository;
        this.motoristaService = motoristaService;
    }

    async criar({ descricao, origem, destino }) {
        if (origem === destino) throw new AppError('Origem e destino não podem ser iguais', 400);

        const entregaExiste = await this.repository.buscarDuplicada({ descricao, origem, destino });
        if (entregaExiste) throw new AppError('Entrega já cadastrada', 409);

        return this.repository.criar({ descricao, origem, destino });
    }

    async listarTodos({ status }) {
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
        entrega.status = novoStatus;
        entrega.historico.push({
            data: new Date().toISOString(),
            status: novoStatus
        });

        return this.repository.atualizar(entrega);
    }

    async cancelarEntrega(id) {
        const entrega = await this.buscarPorId(id);

        const statusAtual = entrega.status;
        if (statusAtual === 'ENTREGUE' || statusAtual === 'CANCELADA') {
            throw new AppError('Transição inválida', 422);
        }

        const novoStatus = 'CANCELADA';
        entrega.status = novoStatus;
        entrega.historico.push({
            data: new Date().toISOString(),
            status: novoStatus
        });
        return this.repository.atualizar(entrega);
    }

    async atribuirEntrega(id, motoristaId) {
        const entrega = await this.buscarPorId(id);
        const motorista = await this.motoristaService.buscarPorId(motoristaId);

        if (entrega.status !== 'CRIADA') {
            throw new AppError('Entrega não pode ser atribuída', 422);
        }

        entrega.motoristaId = motorista.id;
        entrega.historico.push({
            data: new Date().toISOString(),
            status: 'ATRIBUIDA'
        });
        return this.repository.atualizar(entrega);
    }
}