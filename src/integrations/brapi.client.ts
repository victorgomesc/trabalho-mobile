import { z } from "zod";

const brapiResponseSchema = z.object({
  stocks: z.array(
    z.object({
      stock: z.string().trim().min(1),
      name: z.string().nullable().optional(),
      close: z.number().finite().nullable(),
    }),
  ),
  hasNextPage: z.boolean(),
});

export class BrapiClient {
  async listStocks(page: number) {
    const url = new URL("https://brapi.dev/api/quote/list");

    url.searchParams.set("type", "stock");
    url.searchParams.set("sortBy", "name");
    url.searchParams.set("sortOrder", "asc");
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(
        `Falha ao consultar brapi: HTTP ${response.status}`,
      );
    }

    const body: unknown = await response.json();

    return brapiResponseSchema.parse(body);
  }
}