"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { getTrack, lessonsByPass, type TrackSlug } from "@/data/tracks";
import { useConnection, type Connection } from "@/hooks/useConnection";
import { useProgress } from "@/hooks/useProgress";
import { ConnectCard, pendingKey } from "@/components/ConnectCard";
import { GoLocalPanel } from "@/components/GoLocalPanel";
import { ConnectionBadge } from "@/components/ConnectionBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { RefreshButton } from "@/components/RefreshButton";
import { LessonCard } from "@/components/LessonCard";

type GenState =
  | { kind: "idle" }
  | { kind: "generating" }
  | { kind: "exists"; candidate: Connection }
  | { kind: "error"; message: string };

export default function TrackPage() {
  const params = useParams<{ track: string }>();
  const track = getTrack(params.track);
  if (!track) notFound();

  const slug = track.slug as TrackSlug;
  const router = useRouter();
  const search = useSearchParams();
  const { connection, loaded, connect, signOut } = useConnection(slug);
  const { states, loading, error, refresh } = useProgress(track, connection);

  const [gen, setGen] = useState<GenState>({ kind: "idle" });
  const [showClone, setShowClone] = useState(false);

  // After OAuth returns with ?connected=1, auto-create the repo from template.
  const justConnected = search.get("connected") === "1";

  const runGenerate = useCallback(async () => {
    const repoName =
      window.localStorage.getItem(pendingKey(slug)) || track.defaultRepoName;
    setGen({ kind: "generating" });
    try {
      const res = await fetch("/api/repo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track: slug, repoName }),
      });
      const data = await res.json();
      if (data.alreadyExists) {
        setGen({
          kind: "exists",
          candidate: { owner: data.owner, repo: data.repo, branch: data.branch },
        });
        return;
      }
      if (!res.ok) throw new Error(data.error || "Repo creation failed.");
      window.localStorage.removeItem(pendingKey(slug));
      connect({ owner: data.owner, repo: data.repo, branch: data.branch });
      setShowClone(true);
      setGen({ kind: "idle" });
    } catch (e) {
      setGen({
        kind: "error",
        message: e instanceof Error ? e.message : "Repo creation failed.",
      });
    }
  }, [slug, track.defaultRepoName, connect]);

  useEffect(() => {
    if (justConnected && loaded && !connection && gen.kind === "idle") {
      // Clear the query param so a refresh doesn't retrigger generation.
      router.replace(`/${slug}`);
      runGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justConnected, loaded, connection]);

  // ---- Still resolving localStorage / mid-generation ----
  if (!loaded || gen.kind === "generating" || (justConnected && !connection)) {
    return (
      <Shell>
        <p className="text-center text-sm text-slate-500">
          {gen.kind === "generating"
            ? "Creating your repo from the template…"
            : "Loading…"}
        </p>
      </Shell>
    );
  }

  // ---- Not connected: browse the full curriculum, then connect to start ----
  if (!connection) {
    const total = track.lessons.length;
    return (
      <Shell>
        <Link
          href="/"
          className="text-sm text-slate-500 underline-offset-2 hover:text-accent hover:underline"
        >
          ← All tracks
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {track.label}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {track.headline}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {total} lessons across two passes. Browse the full plan below, then
            connect GitHub to create your repo and start tracking your progress.
          </p>
          <a
            href="#connect"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            Connect GitHub &amp; start
            <span aria-hidden>→</span>
          </a>
        </header>

        {([1, 2] as const).map((pass) => {
          const passLessons = lessonsByPass(track, pass);
          return (
            <section key={pass} className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900">
                {track.passes[pass].title}
              </h2>
              <p className="mb-4 mt-1 text-sm text-slate-600">
                {track.passes[pass].blurb}
              </p>
              <div className="flex flex-col gap-3">
                {passLessons.map((l) => (
                  <LessonCard
                    key={l.id}
                    slug={slug}
                    lesson={{ ...l, complete: false, isNext: false }}
                    preview
                  />
                ))}
              </div>
            </section>
          );
        })}

        <section id="connect" className="mt-12 scroll-mt-6 border-t border-slate-200 pt-10">
          {gen.kind === "error" && (
            <div className="mx-auto mb-4 max-w-md rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {gen.message}
            </div>
          )}
          {gen.kind === "exists" ? (
            <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-semibold text-slate-900">
                That repo already exists
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                You already have{" "}
                <span className="font-medium">
                  {gen.candidate.owner}/{gen.candidate.repo}
                </span>
                . Connect it and keep going?
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    window.localStorage.removeItem(pendingKey(slug));
                    connect(gen.candidate);
                    setShowClone(true);
                    setGen({ kind: "idle" });
                  }}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
                >
                  Connect existing repo
                </button>
                <button
                  onClick={() => setGen({ kind: "idle" })}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Pick a different name
                </button>
              </div>
            </div>
          ) : (
            <ConnectCard track={track} onManualConnect={connect} />
          )}
        </section>
      </Shell>
    );
  }

  // ---- Connected: dashboard ----
  const done = states?.filter((s) => s.complete).length ?? 0;
  const total = track.lessons.length;
  const current = states?.find((s) => s.isNext) ?? null;

  return (
    <Shell>
      <header className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {track.label}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {track.headline}
            </h1>
          </div>
          <RefreshButton onClick={refresh} loading={loading} />
        </div>
        <ProgressBar done={done} total={total} />
        <ConnectionBadge
          connection={connection}
          onSignOut={signOut}
          onShowClone={() => setShowClone(true)}
        />
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </header>

      {showClone && (
        <div className="mb-6">
          <GoLocalPanel connection={connection} onDone={() => setShowClone(false)} />
        </div>
      )}

      {current && (
        <section className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Current lesson
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {current.order}. {current.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{current.objective}</p>
          <a
            href={`/${slug}/lesson/${current.id}`}
            className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            Open lesson →
          </a>
        </section>
      )}

      {([1, 2] as const).map((pass) => {
        const passLessons = lessonsByPass(track, pass);
        const stateById = new Map(states?.map((s) => [s.id, s]));
        return (
          <section key={pass} className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900">
              {track.passes[pass].title}
            </h2>
            <p className="mb-4 mt-1 text-sm text-slate-600">
              {track.passes[pass].blurb}
            </p>
            <div className="flex flex-col gap-3">
              {passLessons.map((l) => {
                const s = stateById.get(l.id) ?? {
                  ...l,
                  complete: false,
                  isNext: false,
                };
                return <LessonCard key={l.id} slug={slug} lesson={s} />;
              })}
            </div>
          </section>
        );
      })}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:py-14">
      {children}
    </main>
  );
}
