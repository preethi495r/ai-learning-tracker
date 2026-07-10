"use client";

import { useState } from "react";
import type { Track } from "@/data/tracks";
import type { Connection } from "@/hooks/useConnection";
import { fetchRepoPaths } from "@/lib/github";

const pendingKey = (slug: string) => `tracker:pendingRepoName:${slug}`;

export function ConnectCard({
  track,
  onManualConnect,
}: {
  track: Track;
  onManualConnect: (c: Connection) => void;
}) {
  const [repoName, setRepoName] = useState(track.defaultRepoName);
  const [showManual, setShowManual] = useState(false);

  // Manual "I already have my repo" form state.
  const [owner, setOwner] = useState("");
  const [manualRepo, setManualRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [checking, setChecking] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  const startOAuth = () => {
    // The chosen name must survive the OAuth round-trip; stash it, page reads it back.
    window.localStorage.setItem(pendingKey(track.slug), repoName.trim());
    window.location.href = `/api/auth/login?track=${track.slug}`;
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    setChecking(true);
    try {
      // Validate the public repo is readable before storing it.
      await fetchRepoPaths(owner.trim(), manualRepo.trim(), branch.trim() || "main");
      onManualConnect({
        owner: owner.trim(),
        repo: manualRepo.trim(),
        branch: branch.trim() || "main",
      });
    } catch (err) {
      setManualError(err instanceof Error ? err.message : "Could not reach that repo.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {track.headline}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Connect GitHub and we&apos;ll create your learning repo from the
            starter template. Push your work; this page tracks it.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Repo name</span>
          <input
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>

        <button
          type="button"
          onClick={startOAuth}
          disabled={!repoName.trim()}
          className="rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          Connect GitHub &amp; create my repo
        </button>

        <p className="text-xs text-slate-500">
          This authorizes the app to create one public repo in your account
          (scope <code>public_repo</code>) — nothing else. It&apos;s your repo.
        </p>

        <div className="border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setShowManual((v) => !v)}
            className="text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            I already have my repo
          </button>

          {showManual && (
            <form onSubmit={submitManual} className="mt-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-600">Owner</span>
                  <input
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="her-username"
                    className="rounded-lg border border-slate-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-600">Repo</span>
                  <input
                    required
                    value={manualRepo}
                    onChange={(e) => setManualRepo(e.target.value)}
                    placeholder={track.defaultRepoName}
                    className="rounded-lg border border-slate-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600">Branch</span>
                <input
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="rounded-lg border border-slate-300 px-3 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </label>
              {manualError && (
                <p className="text-sm text-red-600">{manualError}</p>
              )}
              <button
                type="submit"
                disabled={checking}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {checking ? "Checking…" : "Connect this repo"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export { pendingKey };
