// tracks.ts — compose the two curricula into a single Track[] the UI reads from.
// Both curriculum files export the same shape; import with aliases and build the list.
// Content lives in the curriculum files only — never hardcode lessons in components.

import {
  lessons as biLessons,
  PASSES as biPasses,
  COMPLETION_MARKER as biMarker,
  type Lesson,
} from "./curriculum";
import {
  lessons as feLessons,
  PASSES as fePasses,
} from "./curriculum-wife";

export type { Lesson, Resource, ResourceType } from "./curriculum";

// The single completion contract, shared by both tracks: `${repoPath}/DONE.md` exists.
export const COMPLETION_MARKER = biMarker;

export type TrackSlug = "feengineer" | "biengineer";

export interface PassInfo {
  title: string;
  blurb: string;
}

export interface Track {
  slug: TrackSlug;
  label: string;
  headline: string;
  lessons: Lesson[];
  // Keyed 1 | 2 — the two curricula use different pass titles, so keep this structural.
  passes: Record<1 | 2, PassInfo>;
  defaultRepoName: string;
  templateEnvKey: "FRONTEND_TEMPLATE" | "BI_TEMPLATE";
}

export const tracks: Track[] = [
  {
    slug: "feengineer",
    label: "Full-Stack + AI",
    headline: "Your Full-Stack + AI journey",
    lessons: feLessons,
    passes: fePasses,
    defaultRepoName: "fullstack-ai-journey",
    templateEnvKey: "FRONTEND_TEMPLATE",
  },
  {
    slug: "biengineer",
    label: "AI Engineering",
    headline: "Your AI Engineering journey",
    lessons: biLessons,
    passes: biPasses,
    defaultRepoName: "ai-engineering-journey",
    templateEnvKey: "BI_TEMPLATE",
  },
];

export const getTrack = (slug: string): Track | undefined =>
  tracks.find((t) => t.slug === slug);

// Lessons in global curriculum order (across both passes).
export const orderedLessons = (track: Track): Lesson[] =>
  [...track.lessons].sort((a, b) => a.order - b.order);

// Lessons belonging to one pass, in order.
export const lessonsByPass = (track: Track, pass: 1 | 2): Lesson[] =>
  track.lessons.filter((l) => l.pass === pass).sort((a, b) => a.order - b.order);
