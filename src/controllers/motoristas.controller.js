import { AppError } from '../utils/AppError.js';

export class MotoristaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.listarEntregas = this.listarEntregas.bind(this);
        this.novoMotoristaForm = this.novoMotoristaForm.bind(this);
    };
    
    async novoMotoristaForm(req, res, next) {
        res.render('motoristas/novo', { titulo: 'Novo Motorista', dados: {}, erros: [] });
    };

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const motorista = await this.service.buscarPorId(id);
            res.render('motoristas/detalhe', {
                titulo: 'Detalhes do Motorista',
                motorista
            });
        } catch (err) {
            next(err);
        }
    }

    async criar(req, res, next) {
        try {
            const body = req.body;
            const novoMotorista = await this.service.criar(body);
            req.flash('sucesso', 'Motorista criado com sucesso.');
            res.redirect(`/motoristas`);
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.statusCode).render('motoristas/novo', {
                    titulo: 'Novo Motorista',
                    erros: [err.message],
                    dados: req.body,
                });
            }
            next(err);
        }
    };

    async listarTodos(req, res, next) {
        try {
            const motoristas = await this.service.listarTodos();
            res.render('motoristas/listagem', { titulo: 'Listar Motoristas', motoristas });
        } catch (err) {
            next(err);
        }
    }

    async listarEntregas(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.query;
            const entregas = await this.service.listarEntregas(id, { status });
            res.status(200).json(entregas);
        } catch (err) {
            next(err);
        }
    }
};
