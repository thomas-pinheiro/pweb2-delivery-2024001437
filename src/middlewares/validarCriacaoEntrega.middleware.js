import { AppError } from '../utils/AppError.js';

export const validarCriacaoEntrega = (req, res, next) => {
  const { descricao, origem, destino } = req.body;

    if (!descricao || typeof descricao !== 'string') {
        throw new AppError('Descrição inválida', 400);
    }

    if (!origem || typeof origem !== 'string') {
        throw new AppError('Origem inválida', 400);
    }

    if (!destino || typeof destino !== 'string') {
        throw new AppError('Destino inválido', 400);
    }

    next();
};