import { body, validationResult } from 'express-validator';

/**
 * Regras de formato/presença para o formulário de criação de entrega.
 * Regras de negócio (origem ≠ destino, duplicidade) ficam no `EntregaService`.
 */
export const regrasEntrega = [
  body('descricao')
    .trim()
    .notEmpty().withMessage('A descrição é obrigatória')
    .isLength({ min: 2 }).withMessage('A descrição deve ter ao menos 2 caracteres'),

  body('origem')
    .trim()
    .notEmpty().withMessage('A origem é obrigatória'),

  body('destino')
    .trim()
    .notEmpty().withMessage('O destino é obrigatório')
];

/**
 * Se `regrasEntrega` encontrou erro, reexibe `viewName` (400) com as mensagens e os
 * dados já digitados, em vez de seguir para o controller (RF-04).
 * @param {string} viewName View a renderizar em caso de erro, ex.: 'entregas/nova'.
 */
export const validarCriacaoEntrega = (viewName) => (req, res, next) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    const mensagens = erros.array().map(e => e.msg);
    return res.status(400).render(viewName, {
      titulo: 'Nova Entrega',
      erros:  mensagens,
      dados:  req.body,
    });
  }

  next();
};