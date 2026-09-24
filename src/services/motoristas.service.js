import { AppError } from '../utils/AppError.js';

export class MotoristaService {
    constructor(repository) {
        this.repository = repository;
    }

    async criar({ nome, cpf, placaVeiculo }) {
        const motoristaExiste = await this.repository.buscarPorCpf(cpf);
        if (motoristaExiste) throw new AppError('Motorista com CPF já cadastrado', 409);

        return this.repository.criar({ nome, cpf, placaVeiculo });
    }
}