import {
  escalationKeywords,
  highSeverityPhrases,
  prioritizedKeywords,
  stateActorKeywords
} from "@/lib/config/keywords";
import type { Severity } from "@/lib/types/signals";

export function scoreKeywords(input: string): number {
  const lower = input.toLowerCase();

  return prioritizedKeywords.reduce((score, keyword) => {
    return lower.includes(keyword) ? score + 1 : score;
  }, 0);
}

function scoreEscalation(input: string): number {
  const lower = input.toLowerCase();

  return escalationKeywords.reduce((score, keyword) => {
    return lower.includes(keyword) ? score + 2 : score;
  }, 0);
}

function scoreStateActors(input: string): number {
  const lower = input.toLowerCase();

  return stateActorKeywords.reduce((score, keyword) => {
    return lower.includes(keyword) ? score + 1 : score;
  }, 0);
}

function hasHighSeverityOverride(input: string): boolean {
  const lower = input.toLowerCase();

  return highSeverityPhrases.some((phrase) => lower.includes(phrase));
}

export function classifySeverity(input: string, extraScore = 0): Severity {
  if (hasHighSeverityOverride(input)) {
    return "high";
  }

  const score =
    scoreKeywords(input) + scoreEscalation(input) + scoreStateActors(input) + extraScore;

  if (score >= 6) {
    return "high";
  }

  if (score >= 3) {
    return "medium";
  }

  return "low";
}
