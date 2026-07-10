import Link from "next/link";

// Home / track chooser. Explains the site, then routes each learner to her track.
const CHOICES = [
  {
    href: "/feengineer",
    from: "Frontend Engineer",
    to: "AI Engineer",
    blurb:
      "You already own the frontend. Add the backend half and the AI-native layer, then ship real AI products.",
  },
  {
    href: "/biengineer",
    from: "BI Engineer",
    to: "AI Engineer",
    blurb:
      "Turn your data instincts into AI engineering — Python, LLMs, RAG, agents, and portfolio-grade projects.",
  },
  {
    href: "/daengineer",
    from: "Data Analyst",
    to: "AI Engineer",
    blurb:
      "You have Python and basic ML. Add serious prompting, LLM APIs, agents, and GenAI workflows — and ship real AI projects.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">
          Your learning journey, tracked
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-slate-600">
          A guided, lesson-by-lesson path into AI engineering. Connect your
          GitHub, get a personal repo, and watch each lesson turn green as you
          push your work. Pick your track to begin.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHOICES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-accent hover:shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{c.from}</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span aria-hidden className="text-accent">
                →
              </span>
              {c.to}
            </p>
            <p className="mt-3 flex-1 text-sm text-slate-600">{c.blurb}</p>
            <span className="mt-4 text-sm font-medium text-accent underline-offset-2 group-hover:underline">
              Start this track →
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        New here? Just click your track — you&apos;ll connect GitHub there.
      </p>
    </main>
  );
}
