import type { Connection } from "@/hooks/useConnection";

export function ConnectionBadge({
  connection,
  onSignOut,
  onShowClone,
}: {
  connection: Connection;
  onSignOut: () => void;
  onShowClone: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <a
        href={`https://github.com/${connection.owner}/${connection.repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-700 hover:text-accent"
      >
        Connected as {connection.owner}/{connection.repo}
      </a>
      <button
        type="button"
        onClick={onShowClone}
        className="text-slate-500 underline-offset-2 hover:text-accent hover:underline"
      >
        Clone
      </button>
      <button
        type="button"
        onClick={onSignOut}
        className="text-slate-500 underline-offset-2 hover:text-accent hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}
