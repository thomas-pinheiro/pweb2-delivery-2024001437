// Delivery Tracker — Exercício do Cap. 4.
// Este é o ponto de entrada. Ele deve APENAS configurar o app e montar as rotas.
// A regra de negócio fica no Service; o acesso a dados no Repository; a
// composição das dependências (injeção) fica no seu arquivo de rotas.
//
// Comece implementando as camadas em src/ (veja o README) e vá rodando o
// autograder: `npm run check` (com o servidor no ar) ou pela aba Actions no push.
import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { criarRotas } from './routes/index.js';
import { middlewareDeErros } from './middlewares/erros.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Health check exigido pelo contrato de execução (não remova).
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Configuração das views
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Rotas da API e injeção de dependências
app.use('/api', criarRotas());

// Tratamento de erros
app.use(middlewareDeErros);

// 404 para rotas não mapeadas (mantenha por último, antes do listen).
app.use((req, res) => res.status(404).json({ erro: 'recurso não encontrado' }));

export default app;