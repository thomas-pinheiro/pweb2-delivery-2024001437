import { AppError } from '../utils/AppError.js';

export const validarAtribuicaoEntrega = (req, res, next) => {
    const { motoristaId } = req.body;

    if (motoristaId === undefined || motoristaId === null) {
        throw new AppError('motoristaId obrigatório', 400);
    }

    const id = Number(motoristaId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('motoristaId inválido', 400);
    }

    req.body.motoristaId = id;

    next();
};