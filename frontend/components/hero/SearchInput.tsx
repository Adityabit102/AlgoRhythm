"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const SPOTIFY_RE = /open\.spotify\.com\/track\/|spotify:track:|^[a-zA-Z0-9]{16,}$/;

/** Centered Spotify URL input → routes to /predict?track=... */
export function SearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim();
    if (!v || !SPOTIFY_RE.test(v)) {
      setError(true);
      return;
    }
    setError(false);
    router.push(`/predict?track=${encodeURIComponent(v)}`);
  }

  return (
    <form onSubmit={submit} className={cn("w-full max-w-xl", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border-2 bg-cloud p-2 shadow-[var(--shadow-pop)] transition-colors",
          error ? "border-coral" : "border-ink",
        )}
      >
        <span className="pl-3 text-xl" aria-hidden>
          🎧
        </span>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Paste a Spotify track link…"
          aria-label="Spotify track URL"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-ink outline-none placeholder:text-ink/40"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="rounded-full border-2 border-ink bg-cobalt px-6 py-2.5 font-display font-semibold text-cream"
        >
          Analyze
        </motion.button>
      </div>
      <div className="mt-2 h-5 pl-4 text-sm">
        {error ? (
          <span className="text-coral">
            That doesn’t look like a Spotify track link. Try open.spotify.com/track/…
          </span>
        ) : (
          <span className="text-ink/45 font-mono text-xs">
            e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
          </span>
        )}
      </div>
    </form>
  );
}
