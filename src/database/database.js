// Persistência SIMULADA em memória: as coleções e as sequências de id ficam aqui,
// compartilhadas pelos repositories que recebem esta instância.
export class Database {
    constructor() {
        this.entregas = [];
        this.motoristas = [];
        this.sequencias = { entregas: 1, motoristas: 1 };
    }

    /**
     * Gera o próximo id da coleção informada.
     * @param {'entregas' | 'motoristas'} colecao
     * @returns {number}
     */
    proximoId(colecao) {
        return this.sequencias[colecao]++;
    }
}
