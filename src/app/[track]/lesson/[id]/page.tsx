"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getTrack, orderedLessons } from "@/data/tracks";
import { CopyCommand } from "@/components/CopyCommand";
import { ResourceList } from "@/components/ResourceList";

export default function LessonPage() {
  const params = useParams<{ track: string; id: string }>();
  const track = getTrack(params.track);
  if (!track) notFound();

  const ordered = orderedLessons(track);
  const idx = ordered.findIndex((l) => l.id === params.id);
  if (idx === -1) notFound();

  const lesson = ordered[idx];
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const doneCmd = `touch ${lesson.repoPath}/DONE.md && git add -A && git commit -m "done: ${lesson.id}" && git push`;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:py-14">
      <Link
        href={`/${track.slug}`}
        className="text-sm text-slate-500 underline-offset-2 hover:text-accent hover:underline"
      >
        ← {track.headline}
      </Link>

      <header className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">
          Pass {lesson.pass} · Lesson {lesson.order}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {lesson.title}
        </h1>
        <p className="mt-2 text-slate-600">{lesson.objective}</p>
      </header>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          What you&apos;ll cover
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-700 marker:text-accent">
          {lesson.topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Build this
        </h2>
        <p className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-700">
          {lesson.build}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Mark it done
        </h2>
        <p className="mb-3 mt-2 text-sm text-slate-600">
          When you&apos;ve pushed your work, run this from your repo root to flip
          this lesson to complete:
        </p>
        <CopyCommand command={doneCmd} />
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Learning material
        </h2>
        <div className="mt-3">
          <ResourceList resources={lesson.resources} />
        </div>
      </section>

      <nav className="mt-10 flex justify-between gap-4 border-t border-slate-200 pt-6 text-sm">
        {prev ? (
          <Link
            href={`/${track.slug}/lesson/${prev.id}`}
            className="text-slate-600 hover:text-accent"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${track.slug}/lesson/${next.id}`}
            className="text-right text-slate-600 hover:text-accent"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
