"use client";

import Link from "next/link";
import { useState } from "react";

// A lightweight recommender: 4 questions, each option adds points to the three
// tracks. Highest score wins. Pure client-side — no backend, matches the app's rule.

type Slug = "feengineer" | "biengineer" | "daengineer" | "aipm";
type Scores = Record<Slug, number>;

const zero: Scores = { feengineer: 0, biengineer: 0, daengineer: 0, aipm: 0 };

interface Option {
  label: string;
  scores: Partial<Scores>;
}
interface Question {
  q: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    q: "Which best describes your background?",
    options: [
      { label: "Frontend / web developer (React, UIs)", scores: { feengineer: 3 } },
      { label: "BI analyst — SQL, dashboards (Power BI / Tableau)", scores: { biengineer: 3 } },
      { label: "Data analyst who codes in Python", scores: { daengineer: 3 } },
      { label: "Product manager — I ship product with engineers", scores: { aipm: 3 } },
      { label: "Something else / early in my journey", scores: { feengineer: 1, biengineer: 1, daengineer: 1 } },
    ],
  },
  {
    q: "How hands-on with code do you want to get?",
    options: [
      { label: "All the way — I want to write and understand the code", scores: { feengineer: 1, biengineer: 1, daengineer: 1 } },
      { label: "A little — tweak things, but let AI write most of it", scores: { aipm: 2, daengineer: 1 } },
      { label: "Not at all — I'll direct AI and lead, not code myself", scores: { aipm: 4 } },
    ],
  },
  {
    q: "How comfortable are you with Python?",
    options: [
      { label: "Very — I use it regularly", scores: { daengineer: 3, biengineer: 1 } },
      { label: "Some — I can write basic scripts", scores: { biengineer: 2, daengineer: 1 } },
      { label: "Little to none", scores: { biengineer: 1, feengineer: 1, aipm: 1 } },
    ],
  },
  {
    q: "Have you built ML models (e.g. classification with scikit-learn)?",
    options: [
      { label: "Yes, I've trained models", scores: { daengineer: 3 } },
      { label: "No, not really", scores: { feengineer: 1, biengineer: 1 } },
    ],
  },
  {
    q: "What are you most excited to do?",
    options: [
      { label: "Build slick, user-facing AI apps", scores: { feengineer: 3 } },
      { label: "Get answers & insights from data", scores: { biengineer: 2, daengineer: 1 } },
      { label: "Build agents that work over data & tools", scores: { daengineer: 2, biengineer: 1 } },
      { label: "Prototype & lead AI features for my team", scores: { aipm: 3 } },
    ],
  },
];

const TRACKS: Record<
  Slug,
  { label: string; href: string; icon: string; pitch: string; badge: string; accent: string; button: string }
> = {
  feengineer: {
    label: "Frontend Engineer → AI Engineer",
    href: "/feengineer",
    icon: "🎨",
    pitch: "Build on your frontend & TypeScript strengths, add the backend and AI-native layer, and ship accessible AI products.",
    badge: "from-sky-500 to-blue-600",
    accent: "text-sky-600",
    button: "bg-sky-600 hover:bg-sky-700",
  },
  biengineer: {
    label: "BI Engineer → AI Engineer",
    href: "/biengineer",
    icon: "📊",
    pitch: "Learn Python properly from the ground up, then turn your data intuition into RAG, agents, and a LangGraph database agent.",
    badge: "from-violet-500 to-purple-600",
    accent: "text-violet-600",
    button: "bg-violet-600 hover:bg-violet-700",
  },
  daengineer: {
    label: "Data Analyst → AI Engineer",
    href: "/daengineer",
    icon: "🐍",
    pitch: "You already have Python and basic ML — this fills the prompting and AI-workflow gaps and builds toward a data-analysis agent.",
    badge: "from-emerald-500 to-teal-600",
    accent: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  aipm: {
    label: "Product Manager → AI Product Manager",
    href: "/aipm",
    icon: "🚀",
    pitch: "No coding required — get hands-on fluency with prompting, RAG, agents, and MCP, then prototype, evaluate, and ship AI features you can lead with confidence.",
    badge: "from-rose-500 to-pink-600",
    accent: "text-rose-600",
    button: "bg-rose-600 hover:bg-rose-700",
  },
};

const ORDER: Slug[] = ["feengineer", "biengineer", "daengineer", "aipm"];

function winner(scores: Scores): { top: Slug; runnerUp: Slug } {
  const ranked = [...ORDER].sort((a, b) => scores[b] - scores[a]);
  return { top: ranked[0], runnerUp: ranked[1] };
}

export default function FindYourPath() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({ ...zero });
  const [picks, setPicks] = useState<number[]>([]);

  const total = QUESTIONS.length;
  const done = step >= total;

  const choose = (opt: Option, optIndex: number) => {
    setScores((s) => {
      const next = { ...s };
      for (const k of ORDER) next[k] += opt.scores[k] ?? 0;
      return next;
    });
    setPicks((p) => [...p, optIndex]);
    setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    const lastQ = QUESTIONS[step - 1];
    const lastPick = picks[picks.length - 1];
    const opt = lastQ.options[lastPick];
    setScores((s) => {
      const next = { ...s };
      for (const k of ORDER) next[k] -= opt.scores[k] ?? 0;
      return next;
    });
    setPicks((p) => p.slice(0, -1));
    setStep((s) => s - 1);
  };

  const restart = () => {
    setScores({ ...zero });
    setPicks([]);
    setStep(0);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-16">
      <Link
        href="/"
        className="mb-6 text-sm text-slate-500 underline-offset-2 hover:text-accent hover:underline"
      >
        ← All tracks
      </Link>

      {!done ? (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8" key={step}>
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>
                Question {step + 1} of {total}
              </span>
              <span>{Math.round((step / total) * 100)}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${(step / total) * 100}%` }}
              />
            </div>
          </div>

          <h1 className="text-xl font-bold text-slate-900">{QUESTIONS[step].q}</h1>

          <div className="mt-5 flex flex-col gap-3">
            {QUESTIONS[step].options.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => choose(opt, i)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left text-sm font-medium text-slate-700 transition-all duration-200 ease-snap hover:-translate-y-0.5 hover:border-accent hover:shadow-card active:translate-y-0 active:duration-100"
              >
                {opt.label}
                <span className="text-slate-300 transition-transform duration-200 ease-snap group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden>
                  →
                </span>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={back}
              className="mt-5 text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
            >
              ← Back
            </button>
          )}
        </div>
      ) : (
        <Result scores={scores} onRestart={restart} />
      )}
    </main>
  );
}

function Result({ scores, onRestart }: { scores: Scores; onRestart: () => void }) {
  const { top, runnerUp } = winner(scores);
  const t = TRACKS[top];
  const r = TRACKS[runnerUp];

  return (
    <div className="animate-fade-up">
      <p className="text-center text-sm font-medium uppercase tracking-wide text-slate-400">
        Your recommended track
      </p>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className={`flex items-center gap-4 bg-gradient-to-br ${t.badge} p-6 text-white`}>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl" aria-hidden>
            {t.icon}
          </span>
          <h1 className="text-xl font-bold leading-tight">{t.label}</h1>
        </div>
        <div className="p-6">
          <p className="text-slate-600">{t.pitch}</p>
          <Link
            href={t.href}
            className={`group mt-5 inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-200 ease-snap hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:duration-100 ${t.button}`}
          >
            Start {t.label.split(" → ")[0]}&apos;s track
            <span className="transition-transform duration-200 ease-snap group-hover:translate-x-0.5" aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white/70 p-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Also a fit:</span>{" "}
          <Link href={r.href} className={`font-medium ${r.accent} underline-offset-2 hover:underline`}>
            {r.label}
          </Link>
          . You can switch any time — nothing is locked in.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <button onClick={onRestart} className="text-slate-500 underline-offset-2 hover:text-accent hover:underline">
          ↻ Retake quiz
        </button>
        <span className="text-slate-300">·</span>
        <Link href="/" className="text-slate-500 underline-offset-2 hover:text-accent hover:underline">
          See all tracks
        </Link>
      </div>
    </div>
  );
}
