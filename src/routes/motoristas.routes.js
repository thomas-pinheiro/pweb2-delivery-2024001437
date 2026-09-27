import Router from 'express';
import { motoristaController } from '../factories/motoristas.factory.js';
import { validarCriacaoMotorista } from '../middlewares/validarCriacaoMotorista.middleware.js';

const router = Router();

router.post('/', validarCriacaoMotorista, motoristaController.criar);
router.get('/', motoristaController.listarTodos);
router.get('/:id', motoristaController.buscarPorId);

export default router;