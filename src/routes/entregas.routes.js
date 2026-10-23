import { Router } from 'express';
import { regrasEntrega, validarCriacaoEntrega } from '../middlewares/validarCriacaoEntrega.middleware.js';
import { validarAtribuicaoEntrega } from '../middlewares/validarAtribuicaoEntrega.middleware.js';

export function criarEntregasRouter(entregaController, motoristaController) {
    const router = Router();

    router.post('/', regrasEntrega, validarCriacaoEntrega('entregas/nova'), entregaController.criar);
    router.get('/', entregaController.listarTodos);
    router.get('/nova', entregaController.novaEntregaForm);
    router.get('/:id', entregaController.buscarPorId);
    router.patch('/:id/avancar', entregaController.avancarEntrega);
    router.patch('/:id/cancelar', entregaController.cancelarEntrega);
    router.get('/:id/historico', entregaController.obterHistorico);
    router.patch('/:id/atribuir', validarAtribuicaoEntrega, entregaController.atribuirEntrega);

    return router;
}
