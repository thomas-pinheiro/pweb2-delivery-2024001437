import { AppError } from '../utils/AppError.js';

export const validarCriacaoMotorista = (req, res, next) => {
    const { nome, cpf, placaVeiculo } = req.body;

    if (nome === undefined || nome === null) {
        throw new AppError('Nome obrigatório', 400);
    } else if (typeof nome !== 'string' || nome.trim().length === 0) {
        throw new AppError('Nome inválido', 400);
    }

    if (cpf === undefined || cpf === null) {
        throw new AppError('CPF obrigatório', 400);
    } else if (typeof cpf !== 'string' || cpf.trim().length === 0) {
        throw new AppError('CPF inválido', 400);
    } 
    // else {
    //     const cpfRegex = /^\d{11}$/;
    //     if (!cpfRegex.test(cpf)) {
    //         throw new AppError('CPF inválido', 400);
    //     }
    // }

    if (placaVeiculo !== undefined && placaVeiculo !== null) {
        if (typeof placaVeiculo !== 'string') {
            throw new AppError('Placa do veículo deve ser uma string', 400);
        } 

        if (placaVeiculo !== '') {
            const placaRegex = /^(?:[A-Z]{3}\d{4}|[A-Z]{3}\d[A-Z]\d{2})$/i;
            if (!placaRegex.test(placaVeiculo)) {
                throw new AppError('Placa do veículo formato inválido', 400);
            }
        }
    }

    next();
};