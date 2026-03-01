export type PolymarketWatch = {
  id: string;
  label: string;
  slug: string;
  fallbackQuestion: string;
  fallbackUrl: string;
};

export const polymarketWatchlist: PolymarketWatch[] = [
  {
    id: "iran-israel-escalation",
    label: "Iran / Israel",
    slug: "will-iran-and-israel-enter-direct-war",
    fallbackQuestion: "Will Iran and Israel enter direct war?",
    fallbackUrl: "https://polymarket.com/"
  },
  {
    id: "red-sea-shipping",
    label: "Red Sea Shipping",
    slug: "will-red-sea-shipping-face-major-disruption",
    fallbackQuestion: "Will Red Sea shipping face major disruption?",
    fallbackUrl: "https://polymarket.com/"
  },
  {
    id: "oil-spike",
    label: "Oil Spike",
    slug: "will-brent-crude-close-above-100-this-quarter",
    fallbackQuestion: "Will Brent crude close above $100 this quarter?",
    fallbackUrl: "https://polymarket.com/"
  }
];
