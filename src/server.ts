import { app } from "./app";
import { database } from "./config/database";
import { env } from "./config/env";

async function startServer(): Promise<void> {
  try {
    await database.query("SELECT 1");

    app.listen(env.PORT, () => {
      console.log(
        `API executando em http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error(
      "Não foi possível iniciar a aplicação:",
      error,
    );

    process.exit(1);
  }
}

void startServer();