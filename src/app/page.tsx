// The root path is never shared. Show a neutral note instead of exposing tracks.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-3 px-6 py-16">
      <h1 className="text-lg font-semibold">Nothing to see here</h1>
      <p className="text-sm text-slate-600">
        This tracker is shared via a direct link to your track. If you were given
        one, open that link.
      </p>
    </main>
  );
}
