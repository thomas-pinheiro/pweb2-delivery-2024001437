import { AppError } from '../utils/AppError.js';

/** 404 em HTML para qualquer rota não encontrada (RF-05). */
export const naoEncontrado = (req, res) => {
  res.status(404).render('erros/404', {
    titulo:   'Página não encontrada',
    mensagem: `A página "${req.path}" não existe.`,
  });
};

/**
 * Tratador de erro geral. `AppError` vira página de erro com o status/mensagem de
 * negócio (RF-06); qualquer outro erro vira 500 genérico (mensagem só detalhada
 * fora de produção). Responde em JSON em vez de HTML se o `Accept` pedir.
 */
export const middlewareDeErros = (err, req, res, next) => {
  console.error(err);

  const aceitaJson = req.headers['accept']?.includes('application/json');

  if (aceitaJson) {
    const status  = err instanceof AppError ? err.statusCode : 500;
    return res.status(status).json({ erro: err.message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).render('erros/erro', {
      titulo:  `Erro ${err.statusCode}`,
      codigo:  err.statusCode,
      mensagem: err.message,
    });
  }

  res.status(500).render('erros/erro', {
    titulo:   'Erro interno',
    codigo:   500,
    mensagem: process.env.NODE_ENV === 'production'
      ? 'Ocorreu um erro inesperado. Tente novamente.'
      : err.message,
  });
};