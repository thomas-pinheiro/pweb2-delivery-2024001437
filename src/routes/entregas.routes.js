import Router from 'express';
import { EntregaController } from '../controllers/entregas.controller.js';
import { EntregaService } from '../services/entregas.service.js';
import { EntregaRepository } from '../repositories/entregas.repository.js';
import { validarCriacaoEntrega } from '../middlewares/validarCriacaoEntrega.middleware.js';

const repository = new EntregaRepository();
const service = new EntregaService(repository);
const controller = new EntregaController(service);

const router = Router();

router.post('/', validarCriacaoEntrega, controller.criar);
router.get('/', controller.listarTodos);
router.get('/:id', controller.buscarPorId);
router.patch('/:id/avancar', controller.avancarEntrega);
// router.patch('/:id/cancelar', controller.cancelarEntrega);
// router.get('/:id/historico', controller.obterHistorico);

export default router;