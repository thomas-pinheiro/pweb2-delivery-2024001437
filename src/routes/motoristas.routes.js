import Router from 'express';
import { MotoristaController } from '../controllers/motoristas.controller.js';
import { MotoristaService } from '../services/motoristas.service.js';
import { MotoristaRepository } from '../repositories/motoristas.repository.js';
import { validarCriacaoMotorista } from '../middlewares/validarCriacaoMotorista.middleware.js';

const repository = new MotoristaRepository();
const service = new MotoristaService(repository);
const controller = new MotoristaController(service);

const router = Router();

router.post('/', validarCriacaoMotorista, controller.criar);

export default router;