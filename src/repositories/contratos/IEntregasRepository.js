// Contrato do repository de Entregas (+ tipos do domínio usados por ele).
// JavaScript não tem `interface`: o contrato existe só em JSDoc, para documentação
// e checagem pelo editor. Este módulo não exporta código executável.

/**
 * @typedef {'CRIADA' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADA'} StatusEntrega
 */

/**
 * @typedef {Object} EventoHistorico
 * @property {string} data        Data/hora ISO 8601 do evento.
 * @property {string} status      Status (ou evento) registrado.
 * @property {number} [motoristaId] Motorista envolvido, quando o evento é uma atribuição.
 */

/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} origem
 * @property {string} destino
 * @property {StatusEntrega} status
 * @property {number | null} motoristaId
 * @property {EventoHistorico[]} historico
 */

/**
 * @typedef {Object} FiltrosEntrega
 * @property {StatusEntrega} [status]  Retorna só entregas com este status.
 * @property {number} [motoristaId]    Retorna só entregas atribuídas a este motorista.
 */

/**
 * Contrato do repository de Entregas. Os services dependem APENAS destes métodos;
 * qualquer implementação (memória, banco, Mock) que os respeite pode ser injetada.
 *
 * @typedef {Object} IEntregasRepository
 * @property {(filtros?: FiltrosEntrega) => Promise<Entrega[]>} listarTodos
 *   Lista as entregas, aplicando os filtros informados (combináveis).
 * @property {(id: number) => Promise<Entrega | null>} buscarPorId
 *   Busca uma entrega pelo id; `null` se não existir.
 * @property {(dados: { descricao: string, origem: string, destino: string }) => Promise<Entrega>} criar
 *   Persiste uma nova entrega (status `CRIADA`, sem motorista, evento inicial no histórico).
 * @property {(id: number, dados: Partial<Omit<Entrega, 'id'>>) => Promise<Entrega>} atualizar
 *   Atualiza os campos informados de uma entrega existente e a retorna.
 */

export {};
