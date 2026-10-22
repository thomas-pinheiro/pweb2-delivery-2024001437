import { AppError } from '../utils/AppError.js';

export const middlewareDeErros = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .render('erro', { codigo: err.statusCode, mensagem: err.message });
  }
  
  console.error(err);
  res
    .status(500)
    .render('erro', { codigo: 500, mensagem: 'Erro interno do servidor' });
};