// Delivery Tracker — Exercício do Cap. 4.
// Este é o ponto de entrada. Ele deve APENAS configurar o app e montar as rotas.
// A regra de negócio fica no Service; o acesso a dados no Repository; a
// composição das dependências (injeção) fica no seu arquivo de rotas.
//
// Comece implementando as camadas em src/ (veja o README) e vá rodando o
// autograder: `npm run check` (com o servidor no ar) ou pela aba Actions no push.
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criarRotas } from './routes/index.js';
import { middlewareDeErros } from './middlewares/erros.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuração das views
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/base');

// Formulários HTML
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(session({ secret: 'dev-secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.sucesso = req.flash('sucesso');
  res.locals.erro = req.flash('erro');
  next();
});

// app.use(express.json()); retirei pois nao é mais usado

// Health check exigido pelo contrato de execução (não remova).
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Rotas da API e injeção de dependências
app.get('/', (req, res) => res.redirect('/api/entregas'));
app.use('/api', criarRotas());

// Tratamento de erros
app.use(middlewareDeErros);

// 404 para rotas não mapeadas (mantenha por último, antes do listen).
app.use((req, res) => res.status(404).render('erro', { codigo: 404, mensagem: 'Página não encontrada' }));

export default app;