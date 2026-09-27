import Router from 'express';
import { entregaController } from '../factories/entregas.factory.js';
import { validarCriacaoEntrega } from '../middlewares/validarCriacaoEntrega.middleware.js';
import { validarAtribuicaoEntrega } from '../middlewares/validarAtribuicaoEntrega.middleware.js';

const router = Router();

router.post('/', validarCriacaoEntrega, entregaController.criar);
router.get('/', entregaController.listarTodos);
router.get('/:id', entregaController.buscarPorId);
router.patch('/:id/avancar', entregaController.avancarEntrega);
router.patch('/:id/cancelar', entregaController.cancelarEntrega);
router.get('/:id/historico', entregaController.obterHistorico);
router.patch('/:id/atribuir', validarAtribuicaoEntrega, entregaController.atribuirEntrega);


export default router;