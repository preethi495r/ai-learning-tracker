import type { Resource, ResourceType } from "@/data/tracks";

const TYPE_LABEL: Record<ResourceType, string> = {
  video: "Video",
  docs: "Docs",
  article: "Article",
  course: "Course",
  interactive: "Interactive",
};

export function ResourceList({ resources }: { resources: Resource[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-accent hover:shadow-sm"
          >
            <span className="mt-0.5 shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {TYPE_LABEL[r.type]}
            </span>
            <span>
              <span className="font-medium text-slate-800 underline-offset-2 group-hover:underline">
                {r.title}
              </span>
              {r.note && (
                <span className="mt-0.5 block text-sm text-slate-500">
                  {r.note}
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
