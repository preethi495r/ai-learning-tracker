// github.ts — public, client-side progress reads. NO token, NO server route.
// One unauthenticated GitHub tree call per load/refresh derives all completion.
// The completion contract: a lesson is done ⇔ `${repoPath}/DONE.md` exists.

import { COMPLETION_MARKER } from "@/data/tracks";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchRepoPaths(
  owner: string,
  repo: string,
  branch = "main"
): Promise<string[]> {
  // A repo generated from a template is briefly "empty" (GitHub returns 409)
  // until it finishes populating. Retry a few times before giving up.
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (res.status === 404)
      throw new Error(
        "Repo or branch not found (is it public? is the branch 'main'?)"
      );
    if (res.status === 403)
      throw new Error("GitHub rate limit hit — try again shortly.");
    if (res.status === 409) {
      // Repo still initializing. Back off and retry; fail soft on the last try.
      if (attempt < maxAttempts) {
        await sleep(1500);
        continue;
      }
      throw new Error(
        "Your repo is still being set up on GitHub — hit Refresh in a few seconds."
      );
    }
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = await res.json();
    return (data.tree ?? []).map((n: { path: string }) => n.path);
  }
  return [];
}

// Returns the set of repoPaths that have a DONE.md marker under them.
export function computeCompletion(paths: string[]): Set<string> {
  const suffix = "/" + COMPLETION_MARKER;
  const done = new Set<string>();
  for (const p of paths)
    if (p.endsWith(suffix)) done.add(p.slice(0, -suffix.length));
  return done;
}
