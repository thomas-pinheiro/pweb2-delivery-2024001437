import { body, validationResult } from 'express-validator';

// Regras de validação para criação de motorista
export const regrasMotorista = [
  body('nome')
    .trim()
    .notEmpty().withMessage('O nome é obrigatório'),

  body('cpf')
    .trim()
    .notEmpty().withMessage('O CPF é obrigatório'),

  body('placaVeiculo')
    .trim()
    .optional({ checkFalsy: true })
    .matches(/^(?:[A-Z]{3}\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/i)
    .withMessage('Formato de placa inválido')
];

export const validarCriacaoMotorista = (viewName) => (req, res, next) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        const mensagens = erros.array().map(e => e.msg);
        return res.status(400).render(viewName, {
            titulo: 'Novo Motorista',
            erros: mensagens,
            dados: req.body,
        });
    }

    next();
};