import cron from "node-cron";

import { AssetsSyncService } from "../modules/assets/assets-sync.service";

export function startAssetsSyncJob() {
  const service = new AssetsSyncService();

  const expression =
    process.env.ASSETS_SYNC_CRON || "0 19 * * *";

  if (!cron.validate(expression)) {
    throw new Error("ASSETS_SYNC_CRON possui uma expressão inválida");
  }

  const task = cron.schedule(
    expression,
    async () => {
      try {
        await service.execute();
      } catch (error) {
        console.error(
          "[AssetsSync] Falha na sincronização:",
          error,
        );
      }
    },
    {
      name: "assets-sync",
      timezone: "America/Sao_Paulo",
      noOverlap: true,
    },
  );

  console.log(
    `[AssetsSync] Agendamento iniciado: ${expression}`,
  );

  if (process.env.ASSETS_SYNC_RUN_ON_START === "true") {
    void task.execute().catch((error: unknown) => {
      console.error(
        "[AssetsSync] Falha ao iniciar execução:",
        error,
      );
    });
  }

  return task;
}