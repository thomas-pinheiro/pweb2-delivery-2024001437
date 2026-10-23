import { Router } from 'express';
import { EntregasRepositoryPrisma } from '../repositories/entregas.repository.prisma.js';
import { MotoristasRepositoryPrisma } from '../repositories/motoristas.repository.prisma.js';
import { EntregaService } from '../services/entregas.service.js';
import { MotoristaService } from '../services/motoristas.service.js';
import { EntregaController } from '../controllers/entregas.controller.js';
import { MotoristaController } from '../controllers/motoristas.controller.js';
import { criarEntregasRouter } from './entregas.routes.js';
import { criarMotoristasRouter } from './motoristas.routes.js';

// Composition root: ÚNICO ponto onde as dependências são instanciadas e injetadas.
export function criarRotas() {
    const entregasRepo = new EntregasRepositoryPrisma();
    const motoristasRepo = new MotoristasRepositoryPrisma();
    const entregasService = new EntregaService(entregasRepo, motoristasRepo);
    const motoristasService = new MotoristaService(motoristasRepo, entregasRepo);
    const entregasController = new EntregaController(entregasService, motoristasService);
    const motoristasController = new MotoristaController(motoristasService);

    const router = Router();
    router.get('/', (req, res) => res.redirect('/entregas'));
    router.use('/entregas', criarEntregasRouter(entregasController));
    router.use('/motoristas', criarMotoristasRouter(motoristasController));
    return router;
}
