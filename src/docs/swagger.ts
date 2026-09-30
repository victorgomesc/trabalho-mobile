import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Investment Wallet API",
      version: "1.0.0",
      description:
        "API REST para usuários, autenticação, ativos e carteira de investimentos.",
    },

    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor local",
      },
    ],

    tags: [
      { name: "Sistema", description: "Estado da aplicação" },
      { name: "Autenticação", description: "Cadastro e login" },
      { name: "Usuários", description: "Dados do usuário" },
      { name: "Ativos", description: "Ativos financeiros" },
      { name: "Posições", description: "Posições da carteira" },
      { name: "Carteira", description: "Resumo consolidado" },
      {
        name: "Transações",
        description: "Depósitos, saques, saldo e histórico",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Mensagem de erro",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "Victor Gomes",
            },
            email: {
              type: "string",
              format: "email",
              example: "victor@email.com",
            },
            balance: {
              type: "number",
              example: 2500.5,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Asset: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            ticker: {
              type: "string",
              example: "PETR4",
            },
            name: {
              type: "string",
              example: "Petrobras PN",
            },
            type: {
              type: "string",
              enum: [
                "STOCK",
                "CRYPTO",
                "CURRENCY",
                "FUND",
                "FIXED_INCOME",
                "OTHER",
              ],
              example: "STOCK",
            },
            currentPrice: {
              type: "number",
              example: 38.45,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Position: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            assetId: {
              type: "string",
              format: "uuid",
            },
            quantity: {
              type: "number",
              example: 10,
            },
            averagePrice: {
              type: "number",
              example: 35.2,
            },
            currentValue: {
              type: "number",
              example: 384.5,
            },
            profit: {
              type: "number",
              example: 32.5,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            asset: {
              $ref: "#/components/schemas/Asset",
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
            },
          },
        },

        PortfolioSummary: {
          type: "object",
          properties: {
            investedAmount: {
              type: "number",
              example: 5000,
            },
            currentValue: {
              type: "number",
              example: 5450,
            },
            profit: {
              type: "number",
              example: 450,
            },
            profitabilityPercentage: {
              type: "number",
              example: 9,
            },
            balance: {
              type: "number",
              example: 1500,
            },
            positionsCount: {
              type: "integer",
              example: 4,
            },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            assetId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            type: {
              type: "string",
              enum: ["BUY", "SELL", "DEPOSIT", "WITHDRAWAL"],
              example: "DEPOSIT",
            },
            quantity: {
              type: "string",
              example: "0",
            },
            unitPrice: {
              type: "string",
              example: "0.00",
            },
            totalAmount: {
              type: "string",
              example: "1000.00",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        TransactionAmountRequest: {
          type: "object",
          required: ["amount"],
          properties: {
            amount: {
              type: "number",
              minimum: 0,
              exclusiveMinimum: true,
              maximum: 9999999999999.99,
              multipleOf: 0.01,
              description: "Valor em reais, com até duas casas decimais",
              example: 1000,
            },
          },
        },

        TransactionBalanceResponse: {
          type: "object",
          properties: {
            balance: {
              type: "string",
              example: "648.00",
            },
          },
        },

        TransactionOperationResponse: {
          type: "object",
          properties: {
            balance: {
              type: "string",
              example: "1000.00",
            },
            transaction: {
              $ref: "#/components/schemas/Transaction",
            },
          },
        },
      },
    },

    paths: {
      "/api": {
        get: {
          tags: ["Sistema"],
          summary: "Retorna informações da API",
          responses: {
            "200": {
              description: "API funcionando",
            },
          },
        },
      },

      "/api/health": {
        get: {
          tags: ["Sistema"],
          summary: "Verifica a API e o banco de dados",
          responses: {
            "200": {
              description: "API e banco funcionando",
            },
            "500": {
              description: "Erro no banco de dados",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
          },
        },
      },

      "/api/auth/register": {
        post: {
          tags: ["Autenticação"],
          summary: "Cadastra um usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Victor Gomes",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "victor@email.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      minLength: 8,
                      example: "MinhaSenha123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Usuário cadastrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "400": {
              description: "Dados inválidos",
            },
            "409": {
              description: "E-mail já cadastrado",
            },
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Autenticação"],
          summary: "Autentica um usuário",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "victor@email.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "MinhaSenha123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login realizado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "401": {
              description: "E-mail ou senha inválidos",
            },
          },
        },
      },

      "/api/users/me": {
        get: {
          tags: ["Usuários"],
          summary: "Retorna o usuário autenticado",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Usuário encontrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            "401": {
              description: "Não autenticado",
            },
          },
        },

        patch: {
          tags: ["Usuários"],
          summary: "Atualiza o usuário autenticado",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "Victor Gomes",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "victor@email.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Usuário atualizado",
            },
            "400": {
              description: "Dados inválidos",
            },
            "401": {
              description: "Não autenticado",
            },
          },
        },

        delete: {
          tags: ["Usuários"],
          summary: "Exclui o usuário autenticado",
          security: [{ bearerAuth: [] }],
          responses: {
            "204": {
              description: "Usuário excluído",
            },
            "401": {
              description: "Não autenticado",
            },
          },
        },
      },

      "/api/assets": {
        get: {
          tags: ["Ativos"],
          summary: "Lista os ativos",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "search",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              example: "PETR",
            },
            {
              name: "type",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              example: "STOCK",
            },
          ],
          responses: {
            "200": {
              description: "Lista de ativos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Asset",
                    },
                  },
                },
              },
            },
          },
        },

        post: {
          tags: ["Ativos"],
          summary: "Cadastra um ativo",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "ticker",
                    "name",
                    "type",
                    "currentPrice",
                  ],
                  properties: {
                    ticker: {
                      type: "string",
                      example: "PETR4",
                    },
                    name: {
                      type: "string",
                      example: "Petrobras PN",
                    },
                    type: {
                      type: "string",
                      example: "STOCK",
                    },
                    currentPrice: {
                      type: "number",
                      example: 38.45,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Ativo cadastrado",
            },
            "400": {
              description: "Dados inválidos",
            },
            "409": {
              description: "Ticker já cadastrado",
            },
          },
        },
      },

      "/api/assets/{id}": {
        get: {
          tags: ["Ativos"],
          summary: "Busca um ativo pelo ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            "200": {
              description: "Ativo encontrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Asset",
                  },
                },
              },
            },
            "404": {
              description: "Ativo não encontrado",
            },
          },
        },

        patch: {
          tags: ["Ativos"],
          summary: "Atualiza um ativo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                    },
                    currentPrice: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Ativo atualizado",
            },
            "404": {
              description: "Ativo não encontrado",
            },
          },
        },

        delete: {
          tags: ["Ativos"],
          summary: "Exclui um ativo",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            "204": {
              description: "Ativo excluído",
            },
            "404": {
              description: "Ativo não encontrado",
            },
          },
        },
      },

      "/api/positions": {
        get: {
          tags: ["Posições"],
          summary: "Lista as posições do usuário",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Posições encontradas",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Position",
                    },
                  },
                },
              },
            },
          },
        },

        post: {
          tags: ["Posições"],
          summary: "Adiciona um ativo à carteira",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "assetId",
                    "quantity",
                    "averagePrice",
                  ],
                  properties: {
                    assetId: {
                      type: "string",
                      format: "uuid",
                    },
                    quantity: {
                      type: "number",
                      example: 10,
                    },
                    averagePrice: {
                      type: "number",
                      example: 35.2,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Posição criada",
            },
            "400": {
              description: "Dados inválidos",
            },
            "404": {
              description: "Ativo não encontrado",
            },
          },
        },
      },

      "/api/positions/{id}": {
        get: {
          tags: ["Posições"],
          summary: "Busca uma posição pelo ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            "200": {
              description: "Posição encontrada",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Position",
                  },
                },
              },
            },
            "404": {
              description: "Posição não encontrada",
            },
          },
        },

        patch: {
          tags: ["Posições"],
          summary: "Atualiza uma posição",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    quantity: {
                      type: "number",
                      example: 15,
                    },
                    averagePrice: {
                      type: "number",
                      example: 36.1,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Posição atualizada",
            },
            "404": {
              description: "Posição não encontrada",
            },
          },
        },

        delete: {
          tags: ["Posições"],
          summary: "Remove uma posição",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            "204": {
              description: "Posição removida",
            },
            "404": {
              description: "Posição não encontrada",
            },
          },
        },
      },

      "/api/transactions": {
        get: {
          tags: ["Transações"],
          summary: "Lista o histórico do usuário autenticado",
          description:
            "Retorna as últimas 100 operações, da mais recente para a mais antiga.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Histórico de transações",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    maxItems: 100,
                    items: {
                      $ref: "#/components/schemas/Transaction",
                    },
                  },
                },
              },
            },
            "401": {
              description: "Não autenticado ou usuário excluído",
            },
            "409": {
              description: "Conflito entre operações; tente novamente",
            },
            "500": {
              description: "Erro interno do servidor",
            },
          },
        },
      },

      "/api/transactions/balance": {
        get: {
          tags: ["Transações"],
          summary: "Consulta o saldo disponível",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Saldo do usuário autenticado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TransactionBalanceResponse",
                  },
                },
              },
            },
            "401": {
              description: "Não autenticado ou usuário excluído",
            },
            "409": {
              description: "Conflito entre operações; tente novamente",
            },
            "500": {
              description: "Erro interno do servidor",
            },
          },
        },
      },

      "/api/transactions/deposit": {
        post: {
          tags: ["Transações"],
          summary: "Realiza um depósito simulado",
          description:
            "Credita o saldo e registra uma transação DEPOSIT. Não processa pagamentos reais.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TransactionAmountRequest",
                },
                example: {
                  amount: 1000,
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Depósito registrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TransactionOperationResponse",
                  },
                },
              },
            },
            "400": {
              description: "Valor inválido ou limite de saldo excedido",
            },
            "401": {
              description: "Não autenticado ou usuário excluído",
            },
            "409": {
              description: "Conflito entre operações; tente novamente",
            },
            "500": {
              description: "Erro interno do servidor",
            },
          },
        },
      },

      "/api/transactions/withdraw": {
        post: {
          tags: ["Transações"],
          summary: "Realiza um saque simulado",
          description:
            "Desconta do saldo e registra uma transação WITHDRAWAL. Exige saldo suficiente.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TransactionAmountRequest",
                },
                example: {
                  amount: 200,
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Saque registrado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TransactionOperationResponse",
                  },
                },
              },
            },
            "400": {
              description: "Valor inválido ou saldo insuficiente",
            },
            "401": {
              description: "Não autenticado ou usuário excluído",
            },
            "409": {
              description: "Conflito entre operações; tente novamente",
            },
            "500": {
              description: "Erro interno do servidor",
            },
          },
        },
      },

      "/api/portfolio": {
        get: {
          tags: ["Carteira"],
          summary: "Retorna a carteira completa",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Carteira encontrada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      summary: {
                        $ref: "#/components/schemas/PortfolioSummary",
                      },
                      positions: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Position",
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Não autenticado",
            },
          },
        },
      },

      "/api/portfolio/summary": {
        get: {
          tags: ["Carteira"],
          summary: "Retorna o resumo financeiro da carteira",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Resumo calculado",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PortfolioSummary",
                  },
                },
              },
            },
            "401": {
              description: "Não autenticado",
            },
          },
        },
      },
    },
  },

  apis: [],
};

export const swaggerDocument = swaggerJSDoc(options);