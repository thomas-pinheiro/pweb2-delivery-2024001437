import { Router } from 'express';
import { regrasMotorista, validarCriacaoMotorista } from '../middlewares/validarCriacaoMotorista.middleware.js';

export function criarMotoristasRouter(motoristaController) {
    const router = Router();

    router.post('/', regrasMotorista, validarCriacaoMotorista('motoristas/novo'), motoristaController.criar);
    router.get('/novo', motoristaController.novoMotoristaForm);
    router.get('/', motoristaController.listarTodos);
    router.get('/:id', motoristaController.buscarPorId);
    router.get('/:id/entregas', motoristaController.listarEntregas);

    return router;
}
