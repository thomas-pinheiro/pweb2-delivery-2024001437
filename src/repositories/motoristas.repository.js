export class MotoristaRepository {
    constructor() {
        this.motoristas = [];
        this.proximoId = 1;
    }

    async listarTodos() {
        return this.motoristas;
    }
    // async listarTodos({ status }) {
    //     if (status) {
    //         return this.motoristas.filter((e) => e.status === status);
    //     } else {
    //         return this.motoristas;
    //     }
    // }

    // async buscarPorId(id) {
    //     return this.motoristas.find((e) => e.id === id) ?? null;
    // }

    async criar({ nome, cpf, placaVeiculo }) {
        const novo = {
            id: this.proximoId++,
            nome: nome,
            cpf: cpf,
            placaVeiculo: placaVeiculo,
            status: 'ATIVO',
        };
        this.motoristas.push(novo);
        return novo;
    }

    async buscarPorCpf(cpf) {
        return this.motoristas.find((e) => e.cpf === cpf) ?? null;
    }

    // async atualizar(data) {
    //     const index = this.motoristas.findIndex((e) => e.id === data.id);
    //     if (index === -1) {
    //         return null;
    //     }
    //     this.motoristas[index] = data;
    //     return data;
    // }
}