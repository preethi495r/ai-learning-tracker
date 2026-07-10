// Lesson status: done, next, or todo.
export function StatusPill({
  complete,
  isNext,
}: {
  complete: boolean;
  isNext: boolean;
}) {
  if (complete)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <span aria-hidden>✓</span> Done
      </span>
    );
  if (isNext)
    return (
      <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
        Next up
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
      Not started
    </span>
  );
}
