import type { VideoSource } from "@/lib/types/signals";

export const videoSources: VideoSource[] = [
  {
    id: "aljazeera-live",
    label: "Al Jazeera Live",
    embedUrl: "https://www.youtube.com/embed/gCNeDWCI0vo",
    watchUrl: "https://www.youtube.com/watch?v=gCNeDWCI0vo",
    region: "middle-east",
    handle: "@aljazeera"
  },
  {
    id: "skynews-live",
    label: "Sky News Live",
    embedUrl: "https://www.youtube.com/embed/YDvsBbKfLPA",
    watchUrl: "https://www.youtube.com/watch?v=YDvsBbKfLPA",
    region: "europe",
    handle: "@SkyNews"
  },
  {
    id: "france24-live",
    label: "France 24 Live",
    embedUrl: "https://www.youtube.com/embed/Ap-UM1O9RBU",
    watchUrl: "https://www.youtube.com/watch?v=Ap-UM1O9RBU",
    region: "europe",
    handle: "@FRANCE24"
  },
  {
    id: "dw-live",
    label: "DW News",
    embedUrl: "https://www.youtube.com/embed/LuKwFajn37U",
    watchUrl: "https://www.youtube.com/watch?v=LuKwFajn37U",
    region: "europe",
    handle: "@dwnews"
  },
  {
    id: "abc-news-live",
    label: "ABC News",
    embedUrl: "https://www.youtube.com/embed/iipR5yUp36o",
    watchUrl: "https://www.youtube.com/watch?v=iipR5yUp36o",
    region: "north-america",
    handle: "@ABCNews"
  },
  {
    id: "cnbc-live",
    label: "CNBC TV",
    embedUrl: "https://www.youtube.com/embed/9NyxcX3rhQs",
    watchUrl: "https://www.youtube.com/watch?v=9NyxcX3rhQs",
    region: "north-america",
    handle: "@CNBC"
  },
  {
    id: "bloomberg-live",
    label: "Bloomberg TV",
    embedUrl: "https://www.youtube.com/embed/iEpJwprxDdk",
    watchUrl: "https://www.youtube.com/watch?v=iEpJwprxDdk",
    region: "north-america",
    handle: "@markets"
  },
  {
    id: "euronews-live",
    label: "Euronews",
    embedUrl: "https://www.youtube.com/embed/pykpO5kQJ98",
    watchUrl: "https://www.youtube.com/watch?v=pykpO5kQJ98",
    region: "europe",
    handle: "@euronews"
  },
  {
    id: "alarabiya-live",
    label: "Al Arabiya",
    embedUrl: "https://www.youtube.com/embed/e2RgSa1Wt5o",
    watchUrl: "https://www.youtube.com/watch?v=e2RgSa1Wt5o",
    region: "middle-east",
    handle: "@AlArabiya"
  },
  {
    id: "trt-world-live",
    label: "TRT World",
    embedUrl: "https://www.youtube.com/embed/ABfFhWzWs0s",
    watchUrl: "https://www.youtube.com/watch?v=ABfFhWzWs0s",
    region: "middle-east",
    handle: "@TRTWorld"
  },
  {
    id: "ndtv-live",
    label: "NDTV",
    embedUrl: "https://www.youtube.com/embed/uoK1dFpMo98",
    watchUrl: "https://www.youtube.com/watch?v=uoK1dFpMo98",
    region: "asia",
    handle: "@NDTV"
  }
];
