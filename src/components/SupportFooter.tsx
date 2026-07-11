// Small, calm site footer with a "Buy me a coffee" support link.
// Rendered once in the root layout, so it appears on every page.
export function SupportFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-5 pb-10 pt-4">
      <div className="flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-slate-400">
          A guided, git-tracked path to becoming an AI Engineer.
        </p>
        <a
          href="https://buymeacoffee.com/harigovindsmenon"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-card"
        >
          <span aria-hidden>☕</span>
          Enjoying this? Buy me a coffee
        </a>
      </div>
    </footer>
  );
}
