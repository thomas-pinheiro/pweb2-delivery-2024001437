import { AppError } from '../utils/AppError.js';

export class MotoristaService {
    /**
     * @param {import('../repositories/motoristas.repository.js').IMotoristasRepository} motoristasRepository
     * @param {import('../repositories/entregas.repository.js').IEntregasRepository} entregasRepository
     */
    constructor(motoristasRepository, entregasRepository) {
        this.repository = motoristasRepository;
        this.entregasRepository = entregasRepository;
    }

    async criar({ nome, cpf, placaVeiculo }) {
        const motoristaExiste = await this.repository.buscarPorCpf(cpf);
        if (motoristaExiste) throw new AppError('Motorista com CPF já cadastrado', 409);

        return this.repository.criar({ nome, cpf, placaVeiculo });
    }

    async listarTodos() {
        return this.repository.listarTodos();
    }

    async buscarPorId(id) {
        const motorista = await this.repository.buscarPorId(Number(id));
        if (!motorista) {
            throw new AppError('Motorista não encontrado', 404);
        }
        return motorista;
    }

    async listarEntregas(id, { status } = {}) {
        const motorista = await this.buscarPorId(id);
        return this.entregasRepository.listarTodos({ motoristaId: motorista.id, status });
    }
}
