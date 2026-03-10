"use client";

import { createContext, useContext } from "react";
import type { HeadlineItem, SourceStatus } from "@/lib/types/signals";

export type SharedNewsState = {
  items: HeadlineItem[];
  status: SourceStatus[];
  loading: boolean;
  error: string | null;
  lastSuccessAt: number | null;
  refresh: () => Promise<void>;
};

const NewsDataContext = createContext<SharedNewsState | null>(null);

type NewsDataProviderProps = {
  value: SharedNewsState;
  children: React.ReactNode;
};

export function NewsDataProvider({ value, children }: NewsDataProviderProps) {
  return <NewsDataContext.Provider value={value}>{children}</NewsDataContext.Provider>;
}

export function useNewsData() {
  const value = useContext(NewsDataContext);

  if (!value) {
    throw new Error("useNewsData must be used within NewsDataProvider");
  }

  return value;
}
