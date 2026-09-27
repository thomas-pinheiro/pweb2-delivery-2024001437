import { MotoristaController } from '../controllers/motoristas.controller.js';
import { MotoristaService } from '../services/motoristas.service.js';
import { MotoristaRepository } from '../repositories/motoristas.repository.js';

const motoristaRepository = new MotoristaRepository();
const motoristaService = new MotoristaService(motoristaRepository);
const motoristaController = new MotoristaController(motoristaService);

export { motoristaService, motoristaController };