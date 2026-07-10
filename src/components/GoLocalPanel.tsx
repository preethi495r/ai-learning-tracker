import type { Connection } from "@/hooks/useConnection";
import { CopyCommand } from "./CopyCommand";

// Shown after the repo is created (and reachable later via the "Clone" link).
// Gives the learner the exact commands to work locally, plus a zip download.
export function GoLocalPanel({
  connection,
  onDone,
}: {
  connection: Connection;
  onDone?: () => void;
}) {
  const { owner, repo } = connection;
  const cmd = `git clone https://github.com/${owner}/${repo}.git\ncd ${repo}`;
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Your repo is ready — go local
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Everything you push to{" "}
          <span className="font-medium">
            {owner}/{repo}
          </span>{" "}
          drives your progress here. Clone it to start working.
        </p>
      </div>
      <CopyCommand command={cmd} />
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={`https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`}
          className="text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          Download starter .zip
        </a>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            Go to my dashboard
          </button>
        )}
      </div>
    </section>
  );
}
