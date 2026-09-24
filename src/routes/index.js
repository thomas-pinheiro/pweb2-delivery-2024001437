import Router from 'express';
import entregasRouter from './entregas.routes.js';
import motoristasRouter from './motoristas.routes.js';

export function criarRotas() {
    const router = Router();

    router.use('/entregas', entregasRouter);
    router.use('/motoristas', motoristasRouter);
    return router;
}