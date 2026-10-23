import { body, validationResult } from 'express-validator';

// Regras de validação para criação de entrega
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

// Middleware que verifica o resultado da validação
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