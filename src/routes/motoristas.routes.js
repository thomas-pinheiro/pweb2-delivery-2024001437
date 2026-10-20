import { Router } from 'express';
import { validarCriacaoMotorista } from '../middlewares/validarCriacaoMotorista.middleware.js';

export function criarMotoristasRouter(motoristaController) {
    const router = Router();

    router.post('/', validarCriacaoMotorista, motoristaController.criar);
    router.get('/', motoristaController.listarTodos);
    router.get('/:id', motoristaController.buscarPorId);
    router.get('/:id/entregas', motoristaController.listarEntregas);

    return router;
}
