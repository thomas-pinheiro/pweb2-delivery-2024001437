import { AppError } from '../utils/AppError.js';

export class MotoristaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
    };

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const motorista = await this.service.buscarPorId(id);
            res.status(200).json(motorista);
        } catch (err) {
            next(err);
        }
    }

    async criar(req, res, next) {
        try {
            const body = req.body;
            const novoMotorista = await this.service.criar(body);
            res.status(201).json(novoMotorista);
        } catch (err) {
            next(err);
        }
    };

    async listarTodos(req, res, next) {
        try {
            const motoristas = await this.service.listarTodos();
            res.status(200).json(motoristas)
        } catch (err) {
            next(err);
        }
    }
};

