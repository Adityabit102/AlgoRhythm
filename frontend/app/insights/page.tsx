"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { StatCallout } from "@/components/ui/StatCallout";
import { Showcase } from "@/components/three/Showcase";
import { StickerShape } from "@/components/ui/StickerShape";

const BEATS: {
  n: string;
  title: string;
  stat: string;
  statLabel: string;
  tone: "cobalt" | "gold" | "coral" | "mint";
  body: string;
}[] = [
  { n: "01", title: "The Danceability Threshold", stat: "0.55", statLabel: "danceability floor", tone: "cobalt", body: "Below roughly 0.55 danceability, charting becomes vanishingly rare. It behaves like a gate: clearing it doesn’t guarantee a hit, but failing it almost guarantees a miss." },
  { n: "02", title: "The Friday Effect", stat: "2.3×", statLabel: "Friday vs other days", tone: "gold", body: "Friday is the industry’s standard drop day, and it shows. Tracks released on Friday chart 2.3× more often, riding the weekly playlist refresh and a full weekend of first-listen streams." },
  { n: "03", title: "Loudness Wars vs Streaming", stat: "−3 dB", statLabel: "ideal loudness shift", tone: "coral", body: "Streaming normalization quietly ended the loudness war. Post-2015, hits trend toward a more controlled dynamic range — raw loudness stopped buying attention." },
  { n: "04", title: "Genre Hit Rates by Era", stat: "+25 pts", statLabel: "Hip-Hop rise since 2000", tone: "mint", body: "The single biggest structural shift in the data: Hip-Hop’s hit rate climbed steadily as Rock’s fell by half. Genre is era-dependent, so the model encodes genre × era jointly." },
  { n: "05", title: "The Featured Artist Effect", stat: "+31%", statLabel: "collabs vs solos", tone: "cobalt", body: "Tracks with a featured artist out-chart solo releases by about 31%. Collaboration stacks two fanbases and two playlist networks behind a single release." },
  { n: "06", title: "Tempo Distribution of Hits", stat: "95 / 122", statLabel: "twin BPM peaks", tone: "gold", body: "Hit tempo isn’t one number — it’s bimodal. A reggaeton-driven peak near 95 BPM and a pop/dance peak near 122 BPM. The middle is surprisingly quiet." },
  { n: "07", title: "Key & Mode Patterns", stat: "62%", statLabel: "of hits are major-key", tone: "coral", body: "Major-key tracks chart more often, but the gap is smaller than folklore suggests — and it narrows sharply in Hip-Hop and EDM where mode barely moves the needle." },
  { n: "08", title: "Duration Compression", stat: "4:10 → 2:45", statLabel: "median hit length", tone: "mint", body: "The ideal hit got shorter. Streaming pays per-stream after ~30 seconds, so tracks tightened from four-minute structures to sub-three-minute hooks-first builds." },
  { n: "09", title: "Regional Divergence", stat: "8", statLabel: "distinct feature profiles", tone: "cobalt", body: "The features that predict a hit in the US (speechiness) aren’t the ones that predict a hit in India (valence) or the UK (tempo). The Atlas page maps all eight." },
  { n: "10", title: "The Valence Paradox", stat: "−0.08", statLabel: "valence drift since 2010", tone: "gold", body: "Hits have trended slightly sadder. Mean valence among charting tracks has drifted down — the ‘dark banger’ (high energy, low valence) became a reliable pattern." },
  { n: "11", title: "Artist Momentum Effect", stat: "8 hits", statLabel: "where momentum plateaus", tone: "coral", body: "Prior hit count is one of the strongest single predictors — but it saturates. After roughly eight prior hits the marginal lift flattens; reputation has a ceiling." },
  { n: "12", title: "The Cold Start Problem", stat: "0.71", statLabel: "AUC on debut artists", tone: "mint", body: "With no momentum signal, the model leans entirely on audio and timing. It still works for debut artists, just less confidently — the hardest, most interesting case." },
];

export default function InsightsPage() {
  return (
    <main className="flex flex-col">
      <MarqueeStrip text="INSIGHTS · WHAT THE DATA SAYS MAKES A HIT" tone="ink" />

      <section className="relative overflow-hidden bg-cream">
        <StickerShape shape="star" className="absolute right-10 top-10 text-gold" />
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <SectionHeading
              kicker="The research"
              title="Twelve things the charts told us"
            />
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              Every finding below came out of the EDA before a single model was
              trained. Read it like a magazine piece — the model just made it
              measurable.
            </p>
          </div>
          <div className="h-48">
            <Showcase name="boombox" className="h-full w-full" />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {BEATS.map((b) => (
          <motion.article
            key={b.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 border-t-2 border-ink py-12 md:grid-cols-[200px_1fr] md:gap-10"
          >
            <div>
              <StatCallout value={b.stat} label={b.statLabel} tone={b.tone} />
            </div>
            <div>
              <div className="font-mono text-sm text-cobalt">{b.n}</div>
              <h2 className="mt-1 font-display text-3xl font-bold leading-tight">
                {b.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">{b.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
