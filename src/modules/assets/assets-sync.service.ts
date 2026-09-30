import { Prisma } from "@prisma/client";

import { prisma } from "../../config/database";
import { BrapiClient } from "../../integrations/brapi.client";

export class AssetsSyncService {
  private readonly brapiClient = new BrapiClient();

  async execute() {
    let page = 1;
    let processed = 0;
    let skipped = 0;

    console.log("[AssetsSync] Iniciando sincronização");

    while (true) {
      const result = await this.brapiClient.listStocks(page);

      if (result.stocks.length === 0 && result.hasNextPage) {
        throw new Error(
          "A brapi retornou uma página vazia com hasNextPage=true",
        );
      }

      for (const stock of result.stocks) {
        const ticker = stock.stock.trim().toUpperCase();
        const price = stock.close;

        // Não substitui um preço existente por um valor inválido.
        if (
          ticker.length > 20 ||
          price === null ||
          price <= 0 ||
          price >= 10_000_000_000_000
        ) {
          skipped++;
          continue;
        }

        const name = (stock.name?.trim() || ticker).slice(0, 100);

        const currentPrice = new Prisma.Decimal(price.toString())
          .toDecimalPlaces(2);

        await prisma.asset.upsert({
          where: {
            ticker,
          },
          create: {
            ticker,
            name,
            type: "STOCK",
            currentPrice,
          },
          update: {
            name,
            currentPrice,
          },
        });

        processed++;
      }

      if (!result.hasNextPage) {
        break;
      }

      page++;
    }

    console.log(
      `[AssetsSync] Finalizado: ${processed} ativos sincronizados, ` +
      `${skipped} ignorados`,
    );

    return {
      processed,
      skipped,
    };
  }
}