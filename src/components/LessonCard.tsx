import Link from "next/link";
import type { LessonState } from "@/hooks/useProgress";
import { StatusPill } from "./StatusPill";

export function LessonCard({
  slug,
  lesson,
  preview = false,
}: {
  slug: string;
  lesson: LessonState;
  // Preview = browsing before connecting: no completion state to show.
  preview?: boolean;
}) {
  return (
    <Link
      href={`/${slug}/lesson/${lesson.id}`}
      className={`group block rounded-xl border bg-white p-4 shadow-card transition-all duration-300 ease-snap hover:-translate-y-0.5 hover:border-accent hover:shadow-lift active:translate-y-0 active:duration-100 ${
        !preview && lesson.isNext
          ? "border-accent ring-1 ring-accent/20"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {lesson.order}
          </span>
          <div>
            <h3 className="font-medium leading-snug text-slate-900">
              {lesson.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{lesson.objective}</p>
          </div>
        </div>
        {preview ? (
          <span className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-accent" aria-hidden>
            →
          </span>
        ) : (
          <StatusPill complete={lesson.complete} isNext={lesson.isNext} />
        )}
      </div>
      <div className="mt-3 pl-10 text-xs text-slate-400">
        {lesson.resources.length} resource
        {lesson.resources.length === 1 ? "" : "s"}
      </div>
    </Link>
  );
}
