import { EntregaController } from '../controllers/entregas.controller.js';
import { EntregaService } from '../services/entregas.service.js';
import { EntregaRepository } from '../repositories/entregas.repository.js';
import { motoristaService } from './motoristas.factory.js';

const entregaRepository = new EntregaRepository();
const entregaService = new EntregaService(entregaRepository, motoristaService);
const entregaController = new EntregaController(entregaService);

export { entregaService, entregaController };