import { body, validationResult } from 'express-validator';

/**
 * Regras de formato/presença para o formulário de criação de motorista.
 * CPF duplicado é regra de negócio e fica no `MotoristaService`, não aqui.
 */
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

/**
 * Se `regrasMotorista` encontrou erro, reexibe `viewName` (400) com as mensagens e
 * os dados já digitados, em vez de seguir para o controller (RF-04).
 * @param {string} viewName View a renderizar em caso de erro, ex.: 'motoristas/novo'.
 */
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