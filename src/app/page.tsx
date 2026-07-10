import Link from "next/link";

// Home / track chooser. Explains the site and the persona behind each track,
// so a learner can tell at a glance which path fits her.
const CHOICES = [
  {
    href: "/feengineer",
    icon: "🎨",
    from: "Frontend Engineer",
    to: "AI Engineer",
    persona: "You build React / Next.js interfaces and care about UX and accessibility.",
    assumes: "Assumes: comfortable with TypeScript & the frontend. Teaches the backend + AI half.",
    highlights: ["Next.js APIs · Postgres · auth", "AI SDK · streaming AI UIs", "RAG · agents · MCP in TS"],
    ring: "hover:border-sky-300",
    badge: "from-sky-500 to-blue-600",
    accent: "text-sky-600",
    bar: "bg-sky-500",
  },
  {
    href: "/biengineer",
    icon: "📊",
    from: "BI Engineer",
    to: "AI Engineer",
    persona: "You live in SQL, dashboards, and data models (Power BI / Tableau).",
    assumes: "Assumes: strong data intuition. Teaches Python properly, from the ground up.",
    highlights: ["Python from scratch → LLMs", "RAG · ReAct agents · FastMCP", "LangGraph database agent"],
    ring: "hover:border-violet-300",
    badge: "from-violet-500 to-purple-600",
    accent: "text-violet-600",
    bar: "bg-violet-500",
  },
  {
    href: "/daengineer",
    icon: "🐍",
    from: "Data Analyst",
    to: "AI Engineer",
    persona: "You already code in Python and have built basic ML models (e.g. classification).",
    assumes: "Assumes: Python + basic ML. Fills the prompting & AI-workflow gaps.",
    highlights: ["Serious prompting · LLM APIs", "Classical ML → LLMs bridge", "Data agent · evals · n8n"],
    ring: "hover:border-emerald-300",
    badge: "from-emerald-500 to-teal-600",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
  },
];

const STEPS = [
  { n: "1", t: "Connect GitHub", d: "We create your personal learning repo from a template." },
  { n: "2", t: "Do the work, push", d: "Each lesson has an objective, a build, and the exact commands." },
  { n: "3", t: "Watch it turn green", d: "Your pushes drive live progress — no accounts to manage." },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-16">
      <header className="mb-12 text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-500 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          AI Engineering Tracks
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Become an AI Engineer, one lesson at a time
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
          A guided, git-tracked path from where you are today to shipping real AI
          products. Pick the track that matches your background — or let us
          recommend one.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {CHOICES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift ${c.ring}`}
          >
            <span className={`absolute inset-x-0 top-0 h-1 ${c.bar}`} />
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.badge} text-xl shadow-sm`}
              aria-hidden
            >
              {c.icon}
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {c.from}
              </p>
              <h2 className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-slate-900">
                <span className={c.accent} aria-hidden>→</span> {c.to}
              </h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">{c.persona}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {c.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className={`mt-0.5 ${c.accent}`} aria-hidden>✓</span>
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">{c.assumes}</p>
            <span className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${c.accent}`}>
              Start this track
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-5">
        <Link
          href="/find-your-path"
          className="group flex flex-col items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 transition hover:border-accent hover:bg-white sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-sm" aria-hidden>
              🧭
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Not sure which fits?
              </h2>
              <p className="text-sm text-slate-600">
                Answer 4 quick questions and we&apos;ll recommend your ideal track.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent">
            Find your path
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </span>
        </Link>
      </section>

      <section className="mt-14 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{s.t}</p>
              <p className="mt-0.5 text-sm text-slate-500">{s.d}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
