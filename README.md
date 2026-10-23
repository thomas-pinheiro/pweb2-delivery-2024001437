# Delivery Tracker — Interface Web com SSR (EJS)

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 o
> projeto começa como **API JSON** com **arquitetura em camadas** e **Repository Pattern + injeção
> de dependência**. No Cap. 5 a persistência passa a ser **real**, com **Prisma + SQLite**. No
> Cap. 6 (esta entrega) a **API JSON é substituída por uma interface web renderizada no servidor
> (SSR)** com **EJS** — páginas, formulários e ações por botão, no lugar de `res.json()`.

## Como rodar

```bash
npm install                                      # também gera o Prisma Client (postinstall)
cp .env.example .env                             # DATABASE_URL="file:./dev.db"
npx prisma migrate dev                           # cria o banco e aplica as migrations
npm run dev                                      # http://localhost:3000
```

Abra `http://localhost:3000` no navegador — a página redireciona para `/entregas`.

```bash
# em outro terminal, com o servidor no ar — autograder:
npm start
npm run check        # = BASE_URL=http://localhost:3000 node autograder/check.mjs
```

## Estrutura

```
prisma/
├── schema.prisma          # modelos Entrega, Motorista e Evento (histórico)
└── migrations/            # migrations versionadas (geradas por prisma migrate dev)
src/
├── config/database.js     # singleton do Prisma Client
├── controllers/           # traduz HTTP ↔ service — renderiza views (res.render) e redireciona (PRG)
├── services/               # TODA a regra de negócio (intacta desde o Cap. 5)
├── repositories/
│   ├── contratos/         # IEntregasRepository e IMotoristasRepository (JSDoc)
│   ├── *.repository.prisma.js  # implementação com Prisma (em uso, intacta desde o Cap. 5)
│   └── *.repository.js    # implementação em memória (Cap. 4)
├── database/               # banco em memória usado pelos repositories do Cap. 4
├── middlewares/            # validação (express-validator) e tratamento de erros/404 (HTML)
├── routes/                 # composition root (injeção) + monta as rotas em /
├── views/                  # EJS — layout, partials e telas
│   ├── layouts/base.ejs    # layout único (express-ejs-layouts)
│   ├── partials/           # navbar, flash, footer
│   ├── entregas/           # listagem, nova, detalhe
│   ├── motoristas/         # listagem, novo, detalhe
│   └── erros/              # 404 e página de erro genérica
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- **Controllers não fazem mais `res.json()`** (exceto `GET /api/health`) — toda resposta é uma
  view renderizada (`res.render`) ou um redirect (PRG).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de entregas, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico.
- **Atividade 06 — Motoristas + Contratos + DI:** motoristas, atribuição, contratos de
  repository (JSDoc) e composição num ponto único.
- **Atividade 07 — Persistência com Prisma (SQLite):** repositories Prisma no mesmo contrato,
  schema + migrations versionadas; os dados sobrevivem ao reinício. Services e controllers intactos.
- **Atividade 08 — Interface Web com SSR (EJS):** controllers passam a `res.render()` + PRG,
  views EJS (layout + partials), validação com `express-validator` reexibindo o form com erros,
  mensagens flash e `method-override` para disparar PATCH a partir de `<form>` HTML.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Rotas (SSR)

| Método | Rota | Comportamento |
|---|---|---|
| GET | `/` | Redireciona para `/entregas` |
| GET | `/entregas` | Listagem (tabela) + link "Nova Entrega" + filtro por `?status=` |
| GET | `/entregas/nova` | Formulário (`descricao`, `origem`, `destino`) |
| POST | `/entregas` | Cria e redireciona (PRG). Inválido → reexibe o form (`400`) com erros e dados digitados |
| GET | `/entregas/:id` | Detalhe: status, histórico e motorista atribuído. Inexistente → página `404` |
| PATCH | `/entregas/:id/avancar` | Avança o status e redireciona |
| PATCH | `/entregas/:id/cancelar` | Cancela e redireciona |
| PATCH | `/entregas/:id/atribuir` | Recebe `motoristaId` (de um `<select>`) e redireciona |
| GET | `/motoristas` | Listagem |
| GET | `/motoristas/novo` | Formulário (`nome`, `cpf`, `placaVeiculo`) |
| POST | `/motoristas` | Cria e redireciona. CPF duplicado → reexibe o form com erro |
| GET | `/api/health` | `200` `{ "status": "ok" }` (readiness, não removido) |

As ações de estado (`avancar`, `cancelar`, `atribuir`) são `PATCH`. Como um `<form>` HTML só
envia `GET`/`POST`, o form faz `POST .../avancar?_method=PATCH` e o `method-override` traduz
isso para `router.patch(...)`.

## Views e SSR

- **Layout único** (`views/layouts/base.ejs`, via `express-ejs-layouts`) com os partials
  `navbar` e `flash` incluídos em toda página.
- **PRG (Post-Redirect-Get):** toda escrita bem-sucedida responde com redirect — nunca HTML
  direto no mesmo `POST`/`PATCH`.
- **Flash (`connect-flash`):** mensagens de sucesso/erro aparecem na página seguinte ao
  redirect, lidas uma única vez da sessão.
- **Validação (`express-validator`):** formulário inválido é reexibido com as mensagens de
  erro e com os dados já digitados, sempre com status `4xx` (nunca `5xx`).
- **Erros:** entrega/motorista inexistente renderiza uma página `404` em HTML; qualquer outro
  erro não tratado cai numa página de erro genérica (nunca JSON ou stack trace).

## Banco de dados (Prisma + SQLite)

O banco é configurado por `DATABASE_URL` no `.env` (veja `.env.example`); com
`file:./dev.db` o arquivo fica em `prisma/dev.db`. O `.env` e o `dev.db` ficam fora do git.

| Comando | Para quê |
|---|---|
| `npx prisma migrate dev --name <nome>` | Após alterar o `schema.prisma`: cria uma nova migration e aplica no banco local |
| `npx prisma migrate deploy` | Aplica as migrations existentes, sem criar novas (CI/produção) |
| `npx prisma generate` | Regera o Prisma Client (já roda sozinho no `npm install`) |
| `npx prisma studio` | Abre uma interface web para ver e editar os dados |
| `npx prisma migrate reset` | Apaga o banco local e recria a partir das migrations |

No GitHub Actions o workflow define `DATABASE_URL` e roda `prisma migrate deploy` antes de
subir o servidor.

## Composição das dependências

Todas as instâncias são criadas num único ponto — o composition root em
`src/routes/index.js`. Services e controllers nunca fazem `new` de suas dependências;
os services dependem apenas dos contratos `IEntregasRepository` e `IMotoristasRepository`
(documentados em JSDoc em `src/repositories/contratos/`).

Trocar a persistência é trocar uma linha por repository no composition root: hoje são
injetados os repositories Prisma; os de memória (`EntregaRepository(database)`) seguem o
mesmo contrato. Só os repositories acessam o Prisma Client.

```
                       src/routes/index.js  (composition root)
                                       │
                  ┌────────────────────┴────────────────────┐
                  ▼                                         ▼
       EntregasRepositoryPrisma                  MotoristasRepositoryPrisma
        «IEntregasRepository»                     «IMotoristasRepository»
                  │                                         │
                  └────────► src/config/database.js ◄───────┘
                    (singleton PrismaClient → SQLite: prisma/dev.db)

      injetados nos services (cada service recebe os dois repositories):

          EntregasService(entregasRepo, motoristasRepo)
          MotoristasService(motoristasRepo, entregasRepo)
                  │                                         │
                  ▼                                         ▼
          EntregasController                      MotoristasController
           (res.render + redirect)                 (res.render + redirect)
                  │                                         │
                  ▼                                         ▼
              /entregas                                /motoristas
```

A regra "motorista `INATIVO` não pode ser atribuído" fica no `EntregasService`, pois é
regra da atribuição.

## Documentação (JSDoc)

Contratos, services e demais classes são documentados em JSDoc. O HTML gerado fica em
`docs/` (abra `docs/index.html`). Para regenerar após alterar o código:

```bash
npm run docs        # TypeDoc — entende a sintaxe de tipos do TypeScript usada no JSDoc
```

## Contrato (resumo)

- Interface web (SSR, EJS) em `/entregas` e `/motoristas` · `GET /api/health` → `{ "status": "ok" }`.
- Toda escrita bem-sucedida responde com redirect (PRG); formulário inválido reexibe o form
  com status `4xx`; entidade inexistente renderiza página `404`.
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.
- Banco: `DATABASE_URL="file:./dev.db"` no `.env` (forneça `.env.example`).

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): aplica PRG na criação`).
Bom trabalho! 🚀
