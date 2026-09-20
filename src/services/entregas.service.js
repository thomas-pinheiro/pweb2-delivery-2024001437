import { AppError } from '../utils/AppError.js';

export class EntregaService {
    constructor(repository) {
        this.repository = repository;
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
        return this.repository.buscarPorId(id);
    }

    async avancarEntrega(id) {
        const entrega = await this.repository.buscarPorId(id);
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
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
        const entrega = await this.repository.buscarPorId(id);
        if (!entrega) {
            throw new AppError('Entrega não encontrada', 404);
        }
        
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
}