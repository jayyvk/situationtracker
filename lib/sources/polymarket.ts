import { polymarketWatchlist } from "@/lib/config/polymarket-watchlist";
import { fetchJson } from "@/lib/http/fetch-json";
import type { PredictionCard, SourceStatus } from "@/lib/types/signals";

type PolymarketMarket = {
  slug?: string;
  question?: string;
  endDate?: string;
  volumeNum?: number;
  url?: string;
  outcomes?: string;
  outcomePrices?: string;
};

export async function fetchPolymarket(): Promise<{
  predictions: PredictionCard[];
  status: SourceStatus;
}> {
  try {
    const data = await fetchJson<PolymarketMarket[]>(
      "https://gamma-api.polymarket.com/markets?closed=false&limit=200"
    );
    const now = new Date().toISOString();

    const predictions = polymarketWatchlist.map((watch) => {
      const market = data.find((entry) => entry.slug === watch.slug);

      if (!market) {
        return {
          id: watch.id,
          question: watch.fallbackQuestion,
          probability: 0,
          updatedAt: now,
          url: watch.fallbackUrl
        } satisfies PredictionCard;
      }

      const prices = market.outcomePrices ? JSON.parse(market.outcomePrices) : [];
      const rawProbability = Array.isArray(prices) && typeof prices[0] === "number" ? prices[0] : 0;

      return {
        id: watch.id,
        question: market.question ?? watch.fallbackQuestion,
        probability: rawProbability * 100,
        updatedAt: now,
        url: market.url ?? watch.fallbackUrl
      } satisfies PredictionCard;
    });

    return {
      predictions,
      status: {
        source: "polymarket",
        ok: true,
        stale: false,
        lastUpdatedAt: now
      }
    };
  } catch (error) {
    return {
      predictions: polymarketWatchlist.map((watch) => ({
        id: watch.id,
        question: watch.fallbackQuestion,
        probability: 0,
        updatedAt: new Date().toISOString(),
        url: watch.fallbackUrl
      })),
      status: {
        source: "polymarket",
        ok: false,
        stale: true,
        lastUpdatedAt: null,
        message: error instanceof Error ? error.message : "Unable to fetch Polymarket"
      }
    };
  }
}
