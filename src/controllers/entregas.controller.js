import { AppError } from '../utils/AppError.js';

export class EntregaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        // this.listarTodos = this.listarTodos.bind(this);
        // this.buscarPorId = this.buscarPorId.bind(this);
        // this.obterHistorico = this.obterHistorico.bind(this);
        // this.avancarEntrega = this.avancarEntrega.bind(this);
        // this.cancelarEntrega = this.cancelarEntrega.bind(this);
    };

    async criar(req, res, next) {
        try {
            const body = req.body;
            const novaEntrega = await this.service.criar(body);
            res.status(201).json(novaEntrega);
        } catch (err) {
            next(err);
        }
    };

    // async listarTodos(req, res, next) {
    //     try {
    //         throw new AppError('Método não implementado', 400);
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    // async buscarPorId(req, res, next) {
    //     try {
    //         throw new AppError('Método não implementado', 400);
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    // async obterHistorico(req, res, next) {
    //     try {
    //         throw new AppError('Método não implementado', 400);
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    // async avancarEntrega(req, res, next) {
    //     try {
    //         throw new AppError('Método não implementado', 400);
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    // async cancelarEntrega(req, res, next) {
    //     try {
    //         throw new AppError('Método não implementado', 400);
    //     } catch (err) {
    //         next(err);
    //     }
    // };
};

