import { AppError } from '../utils/AppError.js';

/**
 * Controller HTTP de Motoristas: traduz requisições em chamadas ao `MotoristaService`
 * e responde com `res.render` (leitura) ou `res.redirect` (escrita, padrão PRG).
 */
export class MotoristaController {
    constructor(service) {
        this.service = service;

        this.criar = this.criar.bind(this);
        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.listarEntregas = this.listarEntregas.bind(this);
        this.novoMotoristaForm = this.novoMotoristaForm.bind(this);
    };

    /** GET /motoristas/novo — formulário de criação, em branco. */
    async novoMotoristaForm(req, res, next) {
        res.render('motoristas/novo', { titulo: 'Novo Motorista', dados: {}, erros: [] });
    };

    /** GET /motoristas/:id — detalhe do motorista. Fora do contrato SSR, mas útil pro link "Ver" da listagem. */
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

    /**
     * POST /motoristas — cria e redireciona (PRG). CPF duplicado (`AppError` do
     * service) reexibe o form com a mensagem, em vez de seguir pro tratador de erro genérico.
     */
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

    /** GET /motoristas — listagem. */
    async listarTodos(req, res, next) {
        try {
            const motoristas = await this.service.listarTodos();
            res.render('motoristas/listagem', { titulo: 'Listar Motoristas', motoristas });
        } catch (err) {
            next(err);
        }
    }

    /**
     * GET /motoristas/:id/entregas — endpoint JSON extra do Cap. 4/5, fora do
     * contrato SSR desta atividade.
     */
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
