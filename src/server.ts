import { app } from "./app";
import { prisma } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida.");

    app.listen(env.PORT, () => {
      console.log(`API executando em http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Não foi possível iniciar a aplicação:", error);
    process.exit(1);
  }
}

void startServer();