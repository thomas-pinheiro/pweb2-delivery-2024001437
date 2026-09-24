import { AppError } from '../utils/AppError.js';

export class MotoristaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
    };

    async criar(req, res, next) {
        try {
            const body = req.body;
            const novoMotorista = await this.service.criar(body);
            res.status(201).json(novoMotorista);
        } catch (err) {
            next(err);
        }
    };
};

