import { AppError } from '../utils/AppError.js';

export class EntregaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.avancarEntrega = this.avancarEntrega.bind(this);
        this.cancelarEntrega = this.cancelarEntrega.bind(this);
        this.obterHistorico = this.obterHistorico.bind(this);
        this.atribuirEntrega = this.atribuirEntrega.bind(this);
        this.novaEntregaForm = this.novaEntregaForm.bind(this);
    };

    async novaEntregaForm(req, res, next) {
        res.render('entregas/nova', { title: 'Nova Entrega', dados: {}, erros: [] });
    };

    async criar(req, res, next) {
        try {
            const novaEntrega = await this.service.criar(req.body);
            req.flash('sucesso', 'Entrega criada com sucesso.');
            res.redirect(`/entregas/${novaEntrega.id}`);
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.statusCode).render('entregas/nova', {
                    titulo: 'Nova Entrega',
                    erros: [err.message],
                    dados: req.body,
                });
            }
            next(err);
        }
    };

    async listarTodos(req, res, next) {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos({ status });
            res.render('entregas/listagem', { title: 'Entregas', entregas });
        } catch (err) {
            next(err);
        }
    };

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.buscarPorId(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    async avancarEntrega(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.avancarEntrega(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    async cancelarEntrega(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.cancelarEntrega(id);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    };

    async obterHistorico(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.buscarPorId(id);
            res.status(200).json(entrega.historico);
        } catch (err) {
            next(err);
        }
    };

    async atribuirEntrega(req, res, next) {
        try {
            const { id } = req.params;
            const { motoristaId } = req.body;
            const entrega = await this.service.atribuirEntrega(id, motoristaId);
            res.status(200).json(entrega);
        } catch (err) {
            next(err);
        }
    }
};
