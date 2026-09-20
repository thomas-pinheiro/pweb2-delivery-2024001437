export class EntregaRepository {
    constructor() {
        this.entregas = [];
        this.proximoId = 1;
    }

    async listarTodos() {
        return this.entregas;
    }

    // async buscarPorId(id) {
    //     return this.entregas.find((e) => e.id === id) ?? null;
    // }

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
}