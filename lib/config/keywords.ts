export const keywordTaxonomy = {
  conflict: [
    "strike",
    "missile",
    "airstrike",
    "incursion",
    "escalation",
    "mobilization",
    "artillery",
    "drone",
    "naval",
    "interception"
  ],
  civilUnrest: ["protest", "riot", "crackdown", "curfew", "unrest"],
  infrastructure: [
    "blackout",
    "internet outage",
    "telecom",
    "refinery",
    "pipeline",
    "airport",
    "port"
  ],
  macro: ["oil", "shipping", "sanctions", "inflation", "rates"],
  aviation: ["military aircraft", "diversion", "airspace", "closure"],
  maritime: ["tanker", "chokepoint", "strait", "convoy", "ais"]
} as const;

export const prioritizedKeywords = Object.values(keywordTaxonomy).flat();

export const escalationKeywords = [
  "killed",
  "dead",
  "death",
  "dies",
  "assassinated",
  "assassination",
  "leader",
  "president",
  "prime minister",
  "foreign minister",
  "defense minister",
  "commander",
  "general",
  "chief",
  "hostage",
  "hostages",
  "nuclear",
  "reactor",
  "ceasefire collapse",
  "invasion",
  "state of emergency",
  "martial law",
  "regime",
  "retaliation",
  "major attack"
] as const;

export const highSeverityPhrases = [
  "leader killed",
  "president killed",
  "prime minister killed",
  "commander killed",
  "top commander killed",
  "foreign minister killed",
  "assassinated in",
  "launches invasion",
  "declares war",
  "nuclear facility hit",
  "missile barrage",
  "airspace closed",
  "hostages taken"
] as const;

export const stateActorKeywords = [
  "iran",
  "israel",
  "united states",
  "us",
  "russia",
  "ukraine",
  "china",
  "taiwan",
  "hezbollah",
  "hamas",
  "houthi",
  "iaea",
  "nato"
] as const;
