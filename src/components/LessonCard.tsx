import Link from "next/link";
import type { LessonState } from "@/hooks/useProgress";
import { StatusPill } from "./StatusPill";

export function LessonCard({
  slug,
  lesson,
}: {
  slug: string;
  lesson: LessonState;
}) {
  return (
    <Link
      href={`/${slug}/lesson/${lesson.id}`}
      className={`block rounded-xl border bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lift ${
        lesson.isNext ? "border-accent ring-1 ring-accent/20" : "border-slate-200"
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
        <StatusPill complete={lesson.complete} isNext={lesson.isNext} />
      </div>
      <div className="mt-3 pl-10 text-xs text-slate-400">
        {lesson.resources.length} resource
        {lesson.resources.length === 1 ? "" : "s"}
      </div>
    </Link>
  );
}
