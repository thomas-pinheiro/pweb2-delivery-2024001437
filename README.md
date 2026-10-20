# Delivery Tracker — Exercícios dos Capítulos 4 e 5

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. No Cap. 5 a persistência passa a ser **real**, com **Prisma + SQLite**.
> A correção é **automática** (autograder de conformidade) + persistência + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale, crie o banco e rode:
   ```bash
   npm install                                      # também gera o Prisma Client (postinstall)
   cp .env.example .env                             # DATABASE_URL="file:./dev.db"
   npx prisma migrate dev                           # cria o banco e aplica as migrations
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## Estrutura

```
prisma/
├── schema.prisma          # modelos Entrega, Motorista e Evento (histórico)
└── migrations/            # migrations versionadas (geradas por prisma migrate dev)
src/
├── config/database.js     # singleton do Prisma Client
├── controllers/           # traduz HTTP ↔ service (sem regra de negócio)
├── services/              # TODA a regra de negócio
├── repositories/
│   ├── contratos/         # IEntregasRepository e IMotoristasRepository (JSDoc)
│   ├── *.repository.prisma.js  # implementação com Prisma (em uso)
│   └── *.repository.js    # implementação em memória (Cap. 4)
├── database/              # banco em memória usado pelos repositories do Cap. 4
├── routes/                # composition root (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.
- **Atividade 07 — Persistência com Prisma (SQLite):** repositories Prisma no mesmo contrato,
  schema + migrations versionadas; os dados sobrevivem ao reinício. Services e controllers intactos.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Rotas

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/api/health` | — | `200` `{ status: "ok" }` | — |
| POST | `/api/entregas` | `{ descricao, origem, destino }` | `201` entrega (`CRIADA`) | `400` · `409` duplicada |
| GET | `/api/entregas?status=` | — | `200` array | — |
| GET | `/api/entregas/:id` | — | `200` entrega | `404` |
| PATCH | `/api/entregas/:id/avancar` | — | `200` entrega | `404` · `422` |
| PATCH | `/api/entregas/:id/cancelar` | — | `200` entrega | `404` · `422` |
| GET | `/api/entregas/:id/historico` | — | `200` array de eventos | `404` |
| PATCH | `/api/entregas/:id/atribuir` | `{ motoristaId }` | `200` entrega (com `motoristaId`) | `400` · `404` · `422` entrega não-`CRIADA` ou motorista `INATIVO` |
| POST | `/api/motoristas` | `{ nome, cpf, placaVeiculo? }` | `201` motorista (`ATIVO`) | `400` · `409` CPF duplicado |
| GET | `/api/motoristas` | — | `200` array | — |
| GET | `/api/motoristas/:id` | — | `200` motorista | `404` |
| GET | `/api/motoristas/:id/entregas?status=` | — | `200` só as entregas do motorista (filtro combinável) | `404` |

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
                  │                                         │
                  ▼                                         ▼
            /api/entregas                            /api/motoristas
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

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.
- Banco: `DATABASE_URL="file:./dev.db"` no `.env` (forneça `.env.example`).

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀
