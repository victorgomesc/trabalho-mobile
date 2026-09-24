<div align="center">

# 🚀 Carteira de Investimentos — Backend API

### Gerencie usuários, ativos, posições e transações em um só lugar 📈💰

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](./LICENSE)

**API RESTful** construída com **Node.js + TypeScript + Express + Prisma + PostgreSQL** para gestão de carteiras de investimento.

[⚙️ Como Rodar](#️-como-rodar-o-projeto-passo-a-passo) • [🗄️ Banco de Dados](#️-banco-de-dados) • [🧪 Testar Rotas](#-testando-as-rotas) • [📁 Estrutura](#-estrutura-de-pastas) • [🆘 Troubleshooting](#-troubleshooting--erros-comuns)

</div>

---

## 📖 Sobre o Projeto

> Sistema backend para uma **carteira de investimentos**, onde usuários possuem saldo, compram/vendem ativos (ações, FIIs, cryptos) e têm suas posições consolidadas automaticamente.

### ✨ Funcionalidades

| Módulo | Descrição | Status |
| :--- | :--- | :---: |
| 🔐 **Auth** | Registro, login com JWT + bcrypt | 🚧 Em construção |
| 👤 **Users** | CRUD de usuários + saldo | 🚧 Em construção |
| 📊 **Assets** | Cadastro de ativos (ticker, preço) | 🚧 Em construção |
| 💼 **Positions** | Posição consolidada por usuário/ativo | 🚧 Em construção |
| 📈 **Portfolio** | Extrato, rentabilidade e histórico | 🚧 Em construção |
| ✅ **Healthcheck** | Status da API + conexão com o banco | ✅ **Funcionando** |

> 💡 **Estado atual:** o esqueleto da API, banco de dados e as rotas base (`GET /api/` e `GET /api/health`) já estão funcionais. Os módulos de domínio existem como pastas em `src/modules/` e serão plugados em `src/routes/index.ts`.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tech |
| :--- | :--- |
| **Runtime** | Node.js v18+ (testado na v26) |
| **Linguagem** | TypeScript |
| **Framework** | Express v5 |
| **ORM** | Prisma v6 |
| **Banco** | PostgreSQL 15+ |
| **Validação** | Zod |
| **Auth / Cripto** | JSONWebToken + BcryptJS |
| **Segurança** | Helmet + CORS |
| **Logs** | Morgan (`dev`) |
| **Env** | Dotenv + validação com Zod |
| **Dev** | TSX Watch + TSC |

### 📜 Scripts disponíveis (`package.json`)

| Comando | O que faz |
| :--- | :--- |
| `npm run dev` | Roda em modo dev com hot-reload (`tsx watch src/server.ts`) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a versão compilada (`node dist/server.js`) |
| `npm run typecheck` | Só checa os tipos, sem compilar |
| `npx prisma migrate dev` | Aplica migrations no banco |
| `npx prisma studio` | Abre interface visual do banco no navegador |
| `npx prisma generate` | Regenera o Prisma Client |

---

## ⚙️ Como Rodar o Projeto (Passo a Passo)

### 1️⃣ Pré-requisitos

Antes de tudo, você precisa ter instalado:

- [Node.js 18+](https://nodejs.org/) → confira com `node --version`
- [NPM](https://www.npmjs.com/) → confira com `npm --version`
- [PostgreSQL 15+](https://www.postgresql.org/download/) instalado e rodando
- [Git](https://git-scm.com/)

> 💡 Deixe o PostgreSQL **instalado e rodando** antes de continuar. Você vai precisar do **usuário, senha e nome do banco** para montar o `.env` no passo 3.

### 2️⃣ Clonar e instalar

```bash
git clone https://github.com/victorgomesc/trabalho-mobile.git
cd trabalho-mobile
npm install
```

### 3️⃣ Configurar o `.env`

Copie o arquivo de exemplo:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / Mac
cp .env.example .env
```

Abra o `.env` e preencha:

```env
NODE_ENV=development
PORT=3333

DATABASE_URL="postgresql://postgres:senha@localhost:5432/investment_wallet?schema=public"

JWT_SECRET="troque_por_uma_string_aleatoria_com_no_minimo_32_caracteres_123"
JWT_EXPIRES_IN="1d"
```

| Variável | Obrigatória | Padrão | Descrição |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | Não | `development` | `development` \| `test` \| `production` |
| `PORT` | Não | `3333` | Porta onde a API vai rodar |
| `DATABASE_URL` | ✅ Sim | — | String de conexão do PostgreSQL |
| `JWT_SECRET` | ✅ Sim | — | Segredo do JWT (**mín. 32 caracteres**) |
| `JWT_EXPIRES_IN` | Não | `1d` | Tempo de expiração do token (`1d`, `12h`, `60s`...) |

> ⚠️ Se o `JWT_SECRET` tiver menos de 32 caracteres ou a `DATABASE_URL` estiver vazia, a API **nem inicia** e mostra o erro no terminal (validação com Zod em `src/config/env.ts`).

### 4️⃣ Criar o banco + rodar migrations

```bash
# Aplica o schema.prisma no Postgres e gera o Prisma Client
npx prisma migrate dev
```

Se der tudo certo você verá algo como `Your database is now in sync with your schema`.

Comandos úteis do Prisma:

```bash
npx prisma generate      # regenera o client manualmente
npx prisma studio        # abre o banco no navegador (http://localhost:5555)
npx prisma migrate reset # ⚠️ APAGA tudo e reaplica do zero (só em dev!)
```

### 5️⃣ Iniciar a API

```bash
# Modo desenvolvimento (com reload automático)
npm run dev
```

Saída esperada:

```text
Conexão com o banco de dados estabelecida.
API executando em http://localhost:3333
```

Para produção:

```bash
npm run build
npm start
```

🎉 **Pronto!** Acesse: **http://localhost:3333/api/**

---

## 🗄️ Banco de Dados

PostgreSQL gerenciado pelo **Prisma ORM**. Schema oficial em [`prisma/schema.prisma`](./prisma/schema.prisma).

### 🧩 Diagrama entidade-relacionamento

```text
 +------------------+         +-----------------------+         +------------------+
 |      users       |         |  portfolio_positions  |         |      assets      |
 +------------------+         +-----------------------+         +------------------+
 | id (PK, UUID)    |<---+--->| id (PK, UUID)         |<---+--->| id (PK, UUID)    |
 | name             |    |    | user_id (FK)          |    |    | ticker (UNIQUE)  |
 | email (UNIQUE)   |    |    | asset_id (FK)         |    |    | name             |
 | password_hash    |    |    | quantity              |    |    | type             |
 | balance          |    |    | average_price         |    |    | current_price    |
 | created_at       |    |    | updated_at            |    |    | updated_at       |
 +------------------+    |    +-----------------------+    |    +------------------+
                         |             UNIQUE(user_id, asset_id)    |
                         |                                        |
                         |    +-----------------------+           |
                         +--->|     transactions      |<----------+
                              +-----------------------+
                              | id (PK, UUID)         |
                              | user_id (FK) ──► users (CASCADE)   |
                              | asset_id (FK) ─► assets (SET NULL) |
                              | type (ENUM)           |
                              | quantity              |
                              | unit_price            |
                              | total_amount          |
                              | created_at            |
                              +-----------------------+
```

**Regras de relacionamento:**

- `users 1 ─── N portfolio_positions` (ao deletar usuário, deleta posições — `CASCADE`)
- `assets 1 ─── N portfolio_positions` (um usuário só tem **1 posição por ativo** — `UNIQUE(user_id, asset_id)`)
- `users 1 ─── N transactions` (`CASCADE`)
- `assets 1 ─── N transactions` (`SET NULL` — mantém histórico mesmo se o ativo for removido)

### 📋 Detalhamento das tabelas

#### 👤 `users`

| Campo | Tipo (Postgres) | Regras |
| :--- | :--- | :--- |
| `id` | `UUID` | PK, gerado por `gen_random_uuid()` |
| `name` | `VARCHAR(100)` | Obrigatório |
| `email` | `VARCHAR(150)` | Único, obrigatório |
| `password_hash` | `VARCHAR(255)` | Obrigatório (hash bcrypt, nunca senha pura!) |
| `balance` | `DECIMAL(15,2)` | Padrão `0.00` — saldo em R$ |
| `created_at` | `TIMESTAMP` | Padrão `now()` |

#### 📊 `assets`

| Campo | Tipo | Regras / Exemplo |
| :--- | :--- | :--- |
| `id` | `UUID` | PK |
| `ticker` | `VARCHAR(20)` | Único, obrigatório — ex: `PETR4`, `VALE3`, `BTC` |
| `name` | `VARCHAR(100)` | Obrigatório — ex: `Petrobras PN` |
| `type` | `VARCHAR(30)` | Obrigatório — ex: `Ação`, `FII`, `Crypto`, `ETF` |
| `current_price` | `DECIMAL(15,2)` | Obrigatório — cotação atual |
| `updated_at` | `TIMESTAMP` | Atualiza sozinho (`@updatedAt`) |

#### 💸 `transactions`

| Campo | Tipo | Regras |
| :--- | :--- | :--- |
| `id` | `UUID` | PK |
| `user_id` | `UUID` | FK → `users(id)`, `ON DELETE CASCADE` |
| `asset_id` | `UUID?` | FK → `assets(id)`, opcional (depósito/saque não tem ativo) |
| `type` | `ENUM` | `BUY` \| `SELL` \| `DEPOSIT` \| `WITHDRAWAL` |
| `quantity` | `DECIMAL(15,4)` | Padrão `0` |
| `unit_price` | `DECIMAL(15,2)` | Padrão `0.00` |
| `total_amount` | `DECIMAL(15,2)` | Obrigatório (`quantity × unit_price`) |
| `created_at` | `TIMESTAMP` | Padrão `now()` |

#### 💼 `portfolio_positions` (posição consolidada)

| Campo | Tipo | Regras |
| :--- | :--- | :--- |
| `id` | `UUID` | PK |
| `user_id` | `UUID` | FK → `users(id)`, `CASCADE` |
| `asset_id` | `UUID` | FK → `assets(id)` |
| `quantity` | `DECIMAL(15,4)` | Padrão `0` — total de cotas/ações |
| `average_price` | `DECIMAL(15,2)` | Padrão `0.00` — preço médio de compra |
| `updated_at` | `TIMESTAMP` | Auto-atualizado |
| 🔒 Constraint | — | `UNIQUE(user_id, asset_id)` — impede posição duplicada |

### 🔍 Inspecionar o banco na prática

**Opção A — Prisma Studio (visual, recomendado) 🖱️**

```bash
npx prisma studio
```

Abre em `http://localhost:5555` — dá pra ver/editar as 4 tabelas sem escrever SQL.

**Opção B — SQL direto 💻**

```sql
-- Ver tabelas
\dt

-- Ver usuários
SELECT id, name, email, balance FROM users;

-- Ver ativos
SELECT ticker, name, type, current_price FROM assets;

-- Ver carteira de um usuário (posição + cotação atual)
SELECT
  u.name AS usuario,
  a.ticker,
  p.quantity,
  p.average_price AS preco_medio,
  a.current_price AS preco_atual,
  (p.quantity * a.current_price) AS valor_total
FROM portfolio_positions p
JOIN users u ON u.id = p.user_id
JOIN assets a ON a.id = p.asset_id;

-- Ver extrato (últimas transações)
SELECT t.type, a.ticker, t.quantity, t.total_amount, t.created_at
FROM transactions t
LEFT JOIN assets a ON a.id = t.asset_id
ORDER BY t.created_at DESC
LIMIT 20;
```

---

## 🧪 Testando as Rotas

> Todas as rotas começam com o prefixo **`/api`**. Base local: `http://localhost:3333`

### 📌 Tabela de rotas atuais

| Método | Rota | Descrição | Auth? | Status |
| :---: | :--- | :--- | :---: | :---: |
| `GET` | `/api/` | Info da API (nome, versão, status) | Não | ✅ Ativa |
| `GET` | `/api/health` | Checa conexão com o Postgres | Não | ✅ Ativa |
| * | `/api/auth/*` | Login / registro | — | 🚧 Futura |
| * | `/api/users/*` | CRUD usuários | — | 🚧 Futura |
| * | `/api/assets/*` | CRUD ativos | — | 🚧 Futura |
| * | `/api/positions/*` | Posições | — | 🚧 Futura |
| * | `/api/portfolio/*` | Carteira / extrato | — | 🚧 Futura |

### 1️⃣ `GET /api/` — Status da API

**No navegador:** só abrir http://localhost:3333/api/

**Via cURL:**

```bash
curl http://localhost:3333/api/
```

**Via PowerShell:**

```powershell
Invoke-RestMethod http://localhost:3333/api/
```

**Resposta `200 OK` ✅:**

```json
{
  "name": "Investment Wallet API",
  "version": "1.0.0",
  "status": "online"
}
```

### 2️⃣ `GET /api/health` — Saúde + Banco de dados

Essa rota faz um `SELECT 1` real no Postgres via Prisma. Se o banco cair, ela retorna erro.

```bash
curl http://localhost:3333/api/health
```

```powershell
Invoke-RestMethod http://localhost:3333/api/health
```

**Resposta `200 OK` ✅ (banco conectado):**

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-09-24T01:20:15.000Z"
}
```

**Resposta `500` ❌ (banco fora do ar):**

```json
{
  "error": "Erro interno do servidor"
}
```

### 🧰 Testando com Insomnia / Postman / Thunder Client

1. Crie uma **Collection** chamada `Carteira de Investimentos`
2. Crie variável de ambiente `baseUrl = http://localhost:3333`
3. Adicione as requests:
   - `GET {{baseUrl}}/api/` → sem headers, sem body
   - `GET {{baseUrl}}/api/health` → sem headers, sem body
4. (Futuro) Para rotas protegidas: faça login, copie o `token` e use header `Authorization: Bearer <token>`

### ❌ Respostas de erro padrão

| Cenário | Status | Exemplo de body |
| :--- | :---: | :--- |
| Rota inexistente | `404` | `{ "error": "Rota não encontrada" }` |
| Validação Zod falhou | `422` | `{ "error": "Dados inválidos", "details": { "email": ["E-mail inválido"] } }` |
| Erro de regra de negócio | `400/401/404` | `{ "error": "Mensagem amigável" }` |
| Erro inesperado | `500` | `{ "error": "Erro interno do servidor" }` |

> Tratamento centralizado em `src/middlewares/error-handler.ts` + `not-found.ts`.

---

## 📁 Estrutura de Pastas

```text
trabalho-mobile/
├── 📄 .env.example          # Modelo das variáveis de ambiente
├── 📄 package.json          # Scripts + dependências
├── 📁 prisma/
│   ├── schema.prisma        # 🗄️ Modelos: User, Asset, Transaction, PortfolioPosition
│   └── migrations/          # Histórico de migrations SQL
├── 📁 src/
│   ├── app.ts               # Config Express (helmet, cors, json, morgan, /api)
│   ├── server.ts            # Conecta no banco + sobe na PORT
│   ├── config/
│   │   ├── env.ts           # Validação do .env com Zod
│   │   └── database.ts      # Instância única do PrismaClient
│   ├── routes/
│   │   └── index.ts         # Rotas base (/, /health) + futuras (comentadas)
│   ├── middlewares/
│   │   ├── error-handler.ts # Trata AppError, ZodError e 500
│   │   ├── not-found.ts     # Retorna 404 padronizado
│   │   └── validate.ts      # Validação com Zod nos módulos
│   ├── modules/             # Arquitetura por domínio
│   │   ├── auth/            # controller, service, routes, schema
│   │   ├── users/           # controller, service, repository, routes, schema
│   │   ├── assets/          # controller, service, repository, routes, schema
│   │   ├── positions/       # controller, service, repository, routes, schema
│   │   └── portfolio/       # controller, service, routes
│   ├── shared/
│   │   └── errors/
│   │       └── AppError.ts  # Erro customizado (message, statusCode, details)
│   └── types/               # Tipos globais TypeScript
└── 📖 README.md             # Este arquivo 🙂
```

**Padrão de cada módulo:** `*.routes.ts` → `*.controller.ts` → `*.service.ts` → `*.repository.ts` → `*.schema.ts` (Zod).

---

## 🆘 Troubleshooting — Erros Comuns

| Erro / Sintoma | Causa provável | Solução |
| :--- | :--- | :--- |
| `Variáveis de ambiente inválidas` ao dar `npm run dev` | `.env` faltando ou `JWT_SECRET` < 32 chars | Copie o `.env.example` e confira as vars |
| `Can't reach database server at localhost:5432` | Postgres desligado / `DATABASE_URL` errada | Verifique se o PostgreSQL está rodando; confira usuário/senha/banco na `DATABASE_URL` |
| `P1000: Authentication failed` | Senha do banco errada | Confira `DATABASE_URL` |
| `Port 3333 is already in use` | Outra API rodando | Mude `PORT` no `.env` ou mate o processo |
| `npx prisma migrate dev` pede nome da migration | Normal no primeiro uso | Dê um nome ex: `init` |
| `GET /api/health` retorna 500 | Banco caiu depois da API subir | Reconecte o banco e reinicie com `npm run dev` |

**Reset total (dev apenas! ⚠️):**

```bash
npx prisma migrate reset
npm run dev
```

---

## 🤝 Contribuindo

1. Faça um fork + crie uma branch: `git checkout -b feature/minha-feature`
2. Rode `npm run typecheck` antes de commitar
3. Abra um Pull Request descrevendo o que mudou

---

<div align="center">

**Feito com 💙 em Node.js + TypeScript + Prisma + PostgreSQL**

⭐ Se este projeto te ajudou, deixe uma estrela no repositório!

</div>
