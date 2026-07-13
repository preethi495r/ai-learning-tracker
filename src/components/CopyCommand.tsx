"use client";

import { useState } from "react";

// A monospace command block with a copy button. Multi-line safe.
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — the user can still select the text manually.
    }
  };

  return (
    <div className="relative rounded-lg border border-slate-800 bg-slate-900 text-slate-100 shadow-card">
      <pre className="overflow-x-auto px-4 py-3 pr-20 font-mono text-sm leading-relaxed">
        <code>{command}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 rounded-md bg-slate-700/80 px-2.5 py-1 text-xs font-medium text-slate-100 transition-colors duration-200 ease-snap hover:bg-slate-600"
        aria-label="Copy command"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
