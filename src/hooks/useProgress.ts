"use client";

// useProgress(track, connection) — resolves the connected repo, makes ONE public
// tree call, and derives per-lesson { complete, isNext }. Caches per track in
// localStorage: show cached instantly, then revalidate. Never uses a token.

import { useCallback, useEffect, useState } from "react";
import type { Lesson, Track } from "@/data/tracks";
import { orderedLessons } from "@/data/tracks";
import { computeCompletion, fetchRepoPaths } from "@/lib/github";
import type { Connection } from "./useConnection";

export type LessonState = Lesson & { complete: boolean; isNext: boolean };

const cacheKey = (slug: string) => `tracker:progress:${slug}`;

function attach(track: Track, done: Set<string>): LessonState[] {
  const ordered = orderedLessons(track);
  let nextAssigned = false;
  return ordered.map((l) => {
    const complete = done.has(l.repoPath);
    const isNext = !complete && !nextAssigned;
    if (isNext) nextAssigned = true;
    return { ...l, complete, isNext };
  });
}

function readCache(slug: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(slug));
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function useProgress(track: Track, connection: Connection | null) {
  const [states, setStates] = useState<LessonState[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!connection) return;
    setLoading(true);
    setError(null);
    try {
      const paths = await fetchRepoPaths(
        connection.owner,
        connection.repo,
        connection.branch
      );
      window.localStorage.setItem(
        cacheKey(track.slug),
        JSON.stringify(Array.from(computeCompletion(paths)))
      );
      setStates(attach(track, computeCompletion(paths)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to read progress.");
    } finally {
      setLoading(false);
    }
  }, [track, connection]);

  // Show cached progress instantly, then revalidate from the network.
  useEffect(() => {
    if (!connection) {
      setStates(null);
      return;
    }
    const cached = readCache(track.slug);
    if (cached) setStates(attach(track, new Set(cached)));
    load();
  }, [track, connection, load]);

  return { states, loading, error, refresh: load };
}
