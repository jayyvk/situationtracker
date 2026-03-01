export type RssSourceConfig = {
  id: string;
  label: string;
  url: string;
  category: "wire" | "defense" | "energy" | "geopolitics";
};

export const rssSources: RssSourceConfig[] = [
  {
    id: "ap-world",
    label: "AP World",
    url: "https://apnews.com/hub/ap-top-news?output=rss",
    category: "wire"
  },
  {
    id: "bbc-world",
    label: "BBC World",
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    category: "wire"
  },
  {
    id: "reuters-world",
    label: "Reuters World",
    url: "https://feeds.reuters.com/Reuters/worldNews",
    category: "wire"
  },
  {
    id: "aljazeera",
    label: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    category: "geopolitics"
  },
  {
    id: "defense-one",
    label: "Defense One",
    url: "https://www.defenseone.com/rss/all/",
    category: "defense"
  },
  {
    id: "breaking-defense",
    label: "Breaking Defense",
    url: "https://breakingdefense.com/feed/",
    category: "defense"
  },
  {
    id: "oilprice",
    label: "OilPrice",
    url: "https://oilprice.com/rss/main",
    category: "energy"
  },
  {
    id: "guardian-world",
    label: "Guardian World",
    url: "https://www.theguardian.com/world/rss",
    category: "wire"
  }
];
