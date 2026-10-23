import { AppError } from '../utils/AppError.js';

export class EntregaController {
    constructor(service, motoristasService) {
        this.service = service;
        this.motoristasService = motoristasService;

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
            res.redirect(`/entregas`);
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

            const motoristas = entrega.status === 'CRIADA'
                ? await this.motoristasService.listarTodos()
                : [];

            const motoristaAtribuido = entrega.motoristaId
                ? await this.motoristasService.buscarPorId(entrega.motoristaId)
                : null;

            res.render('entregas/detalhe', {
                titulo: 'Detalhes da Entrega',
                entrega,
                motoristas,
                motoristaAtribuido,
            });
        } catch (err) {
            next(err);
        }
    };

    async avancarEntrega(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.avancarEntrega(id);
            req.flash('sucesso', 'Status avançado.');
            res.redirect(`/entregas/${id}`);
        } catch (err) {
            if (err instanceof AppError) {
                req.flash('erro', err.message);
                return res.redirect(`/entregas/${id}`);
            }
            next(err);
        }
    };

    async cancelarEntrega(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.cancelarEntrega(id);
            req.flash('sucesso', 'Entrega cancelada.');
            res.redirect(`/entregas/${id}`);
        } catch (err) {
            if (err instanceof AppError) {
                req.flash('erro', err.message);
                return res.redirect(`/entregas/${id}`);
            }
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
            req.flash('sucesso', 'Motorista atribuído com sucesso.');
            res.redirect(`/entregas/${id}`);
        } catch (err) {
            if (err instanceof AppError) {
                req.flash('erro', err.message);
                return res.redirect(`/entregas/${id}`);
            }
            next(err);
        }
    };
};
