export class EntregaRepository {
    constructor() {
        this.entregas = [];
        this.proximoId = 1;
    }

    async listarTodos({ status }) {
        if (status) {
            return this.entregas.filter((e) => e.status === status);
        } else {
            return this.entregas;
        }
    }

    async buscarPorId(id) {
        return this.entregas.find((e) => e.id === id) ?? null;
    }

    async criar(dados) {
        const novo = {
            id: this.proximoId++,
            motoristaId: null,
            status: 'CRIADA',
            historico: [
                {
                    data: new Date().toISOString(),
                    status: 'CRIADA'
                }
            ],
            ...dados
        };
        this.entregas.push(novo);
        return novo;
    }

    async buscarDuplicada(entrega) {
        return this.entregas.find((e) =>
            e.descricao === entrega.descricao &&
            e.origem === entrega.origem &&
            e.destino === entrega.destino
        ) ?? null;
    }

    async atualizar(entrega) {
        const index = this.entregas.findIndex((e) => e.id === entrega.id);
        if (index === -1) {
            return null;
        }
        this.entregas[index] = entrega;
        return entrega;
    }
}