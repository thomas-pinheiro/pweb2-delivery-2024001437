import { AppError } from '../utils/AppError.js';

export class EntregaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
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

    async listarTodos(req, res, next) {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos({ status });
            res.status(200).json(entregas);
        } catch (err) {
            next(err);
        }
    };

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.buscarPorId(Number(id));
            if (!entrega) {
                throw new AppError('Entrega não encontrada', 404);
            }
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

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

