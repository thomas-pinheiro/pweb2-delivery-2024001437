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
}