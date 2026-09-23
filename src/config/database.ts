import { Pool } from "pg";
import { env } from "./env";

export const database = new Pool({
  connectionString: env.DATABASE_URL,
});

database.on("error", (error) => {
  console.error("Erro inesperado na conexão com o banco:", error);
});