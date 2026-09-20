import Router from 'express';
import entregasRouter from './entregas.routes.js';

export function criarRotas() {
    const router = Router();

    router.use('/entregas', entregasRouter);
    return router;
}