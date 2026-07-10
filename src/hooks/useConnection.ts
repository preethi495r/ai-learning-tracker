"use client";

// useConnection(track) — the learner's connected repo, held in localStorage,
// keyed per track slug. This is the whole "connected" state. No server session.

import { useCallback, useEffect, useState } from "react";
import type { TrackSlug } from "@/data/tracks";

export interface Connection {
  owner: string;
  repo: string;
  branch: string;
}

const key = (slug: string) => `tracker:connection:${slug}`;

function read(slug: string): Connection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(slug));
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (c && c.owner && c.repo) return { branch: "main", ...c };
    return null;
  } catch {
    return null;
  }
}

export function useConnection(slug: TrackSlug) {
  const [connection, setConnection] = useState<Connection | null>(null);
  // Distinguishes "still reading localStorage" from "read, found nothing".
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setConnection(read(slug));
    setLoaded(true);
  }, [slug]);

  const connect = useCallback(
    (c: Connection) => {
      const normalized: Connection = {
        owner: c.owner.trim(),
        repo: c.repo.trim(),
        branch: (c.branch || "main").trim(),
      };
      window.localStorage.setItem(key(slug), JSON.stringify(normalized));
      setConnection(normalized);
    },
    [slug]
  );

  const signOut = useCallback(() => {
    window.localStorage.removeItem(key(slug));
    // Also drop this track's cached progress.
    window.localStorage.removeItem(`tracker:progress:${slug}`);
    setConnection(null);
  }, [slug]);

  return { connection, loaded, connect, signOut };
}
