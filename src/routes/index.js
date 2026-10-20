import Router from 'express';
import { Database } from '../database/database.js';
import { EntregaRepository } from '../repositories/entregas.repository.js';
import { MotoristaRepository } from '../repositories/motoristas.repository.js';
import { EntregaService } from '../services/entregas.service.js';
import { MotoristaService } from '../services/motoristas.service.js';
import { EntregaController } from '../controllers/entregas.controller.js';
import { MotoristaController } from '../controllers/motoristas.controller.js';
import { criarEntregasRouter } from './entregas.routes.js';
import { criarMotoristasRouter } from './motoristas.routes.js';

// Composition root: ÚNICO ponto onde as dependências são instanciadas e injetadas.
export function criarRotas() {
    const database = new Database();
    const entregasRepo = new EntregaRepository(database);
    const motoristasRepo = new MotoristaRepository(database);
    const entregasService = new EntregaService(entregasRepo, motoristasRepo);
    const motoristasService = new MotoristaService(motoristasRepo, entregasRepo);
    const entregasController = new EntregaController(entregasService);
    const motoristasController = new MotoristaController(motoristasService);

    const router = Router();
    router.use('/entregas', criarEntregasRouter(entregasController));
    router.use('/motoristas', criarMotoristasRouter(motoristasController));
    return router;
}
