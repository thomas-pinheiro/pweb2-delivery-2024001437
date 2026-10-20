// Contrato do repository de Motoristas (+ tipos do domínio usados por ele).
// JavaScript não tem `interface`: o contrato existe só em JSDoc, para documentação
// e checagem pelo editor. Este módulo não exporta código executável.

/**
 * @typedef {'ATIVO' | 'INATIVO'} StatusMotorista
 */

/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf            Único entre os motoristas.
 * @property {string} [placaVeiculo]
 * @property {StatusMotorista} status
 */

/**
 * Contrato do repository de Motoristas. Os services dependem APENAS destes métodos;
 * qualquer implementação (memória, banco, Mock) que os respeite pode ser injetada.
 *
 * @typedef {Object} IMotoristasRepository
 * @property {() => Promise<Motorista[]>} listarTodos
 *   Lista todos os motoristas.
 * @property {(id: number) => Promise<Motorista | null>} buscarPorId
 *   Busca um motorista pelo id; `null` se não existir.
 * @property {(cpf: string) => Promise<Motorista | null>} buscarPorCpf
 *   Busca um motorista pelo CPF; `null` se não existir.
 * @property {(dados: { nome: string, cpf: string, placaVeiculo?: string }) => Promise<Motorista>} criar
 *   Persiste um novo motorista com status `ATIVO`.
 */

export {};
