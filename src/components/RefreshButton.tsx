"use client";

export function RefreshButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      <span aria-hidden className={loading ? "animate-spin" : ""}>
        ↻
      </span>
      {loading ? "Refreshing…" : "Refresh"}
    </button>
  );
}
