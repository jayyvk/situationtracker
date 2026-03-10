"use client";

import { useEffect, useRef, useState } from "react";

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastSuccessAt: number | null;
};

export function usePollingResource<T>(url: string, intervalMs: number) {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    loading: true,
    error: null,
    lastSuccessAt: null
  });
  const lastGoodData = useRef<T | null>(null);
  const refreshCounter = useRef(0);

  useEffect(() => {
    let mounted = true;

    async function load(force = false) {
      try {
        const requestUrl = new URL(url, window.location.origin);

        if (force) {
          refreshCounter.current += 1;
          requestUrl.searchParams.set("refresh", String(refreshCounter.current));
        }

        const response = await fetch(requestUrl.toString());

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as T;

        if (!mounted) {
          return;
        }

        lastGoodData.current = payload;
        setState({
          data: payload,
          loading: false,
          error: null,
          lastSuccessAt: Date.now()
        });
      } catch (error) {
        if (!mounted) {
          return;
        }

        setState((current) => ({
          data: current.data ?? lastGoodData.current,
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load resource",
          lastSuccessAt: current.lastSuccessAt
        }));
      }
    }

    void load();
    const timer =
      intervalMs > 0
        ? window.setInterval(() => {
            void load();
          }, intervalMs)
        : null;

    return () => {
      mounted = false;
      if (timer !== null) {
        window.clearInterval(timer);
      }
    };
  }, [intervalMs, url]);

  return {
    ...state,
    refresh: async () => {
      const requestUrl = new URL(url, window.location.origin);
      refreshCounter.current += 1;
      requestUrl.searchParams.set("refresh", String(refreshCounter.current));

      try {
        const response = await fetch(requestUrl.toString(), { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as T;
        lastGoodData.current = payload;
        setState({
          data: payload,
          loading: false,
          error: null,
          lastSuccessAt: Date.now()
        });
      } catch (error) {
        setState((current) => ({
          data: current.data ?? lastGoodData.current,
          loading: false,
          error: error instanceof Error ? error.message : "Unable to load resource",
          lastSuccessAt: current.lastSuccessAt
        }));
      }
    }
  };
}
