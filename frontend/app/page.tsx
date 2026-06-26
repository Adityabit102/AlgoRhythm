export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cobalt">
        The science behind every hit
      </span>
      <h1 className="font-display max-w-3xl text-5xl font-bold leading-[0.95] sm:text-7xl">
        What makes a song a hit?
        <br />
        <span className="text-cobalt">The data has an answer.</span>
      </h1>
      <p className="max-w-xl text-lg text-ink/70">
        Foundation is wired up — palette, fonts, state, and mock API are live. The
        full 3D hero and pages land in the next phases.
      </p>
      <div className="mt-4 inline-flex rounded-full pop-border bg-gold px-6 py-3 font-display font-semibold shadow-[var(--shadow-pop-sm)]">
        AlgoRhythm 🎧
      </div>
    </main>
  );
}
