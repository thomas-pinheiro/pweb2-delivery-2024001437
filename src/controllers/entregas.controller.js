import { AppError } from '../utils/AppError.js';

/**
 * Controller HTTP de Entregas: traduz requisições em chamadas ao `EntregaService` e
 * responde com `res.render` (leitura) ou `res.redirect` (escrita, padrão PRG) —
 * nunca `res.json`.
 */
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

    /** GET /entregas/nova — formulário de criação, em branco. */
    async novaEntregaForm(req, res, next) {
        res.render('entregas/nova', { titulo: 'Nova Entrega', dados: {}, erros: [] });
    };

    /**
     * POST /entregas — cria e redireciona (PRG). Erro de negócio (ex.: origem ==
     * destino, duplicada) reexibe o form com a mensagem, em vez de seguir pro
     * tratador de erro genérico.
     */
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

    /** GET /entregas — listagem, com filtro opcional por `?status=`. */
    async listarTodos(req, res, next) {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos({ status });
            res.render('entregas/listagem', { titulo: 'Entregas', entregas, statusFiltro: status || '' });
        } catch (err) {
            next(err);
        }
    };

    /**
     * GET /entregas/:id — detalhe, histórico e motorista atribuído (se houver).
     * Só busca a lista de motoristas ativos quando o `<select>` de atribuição vai
     * ser exibido (status `CRIADA`), evitando uma query desnecessária.
     */
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

    /** PATCH /entregas/:id/avancar — avança o status e redireciona pro detalhe (PRG). */
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

    /** PATCH /entregas/:id/cancelar — cancela e redireciona pro detalhe (PRG). */
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

    /**
     * GET /entregas/:id/historico — endpoint JSON extra do Cap. 4/5, fora do
     * contrato SSR desta atividade (o histórico já vem embutido no detalhe).
     */
    async obterHistorico(req, res, next) {
        try {
            const { id } = req.params;
            const entrega = await this.service.buscarPorId(id);
            res.status(200).json(entrega.historico);
        } catch (err) {
            next(err);
        }
    };

    /** PATCH /entregas/:id/atribuir — atribui o motorista e redireciona pro detalhe (PRG). */
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
