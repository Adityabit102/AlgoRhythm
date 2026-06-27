"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { predictTrack } from "@/lib/api";
import { useHistory } from "@/lib/store";
import { Spinner } from "@/components/ui/Spinner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/hero/SearchInput";
import { Showcase } from "@/components/three/Showcase";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { RegionalScores } from "@/components/prediction/RegionalScores";
import { ShapWaterfall } from "@/components/prediction/ShapWaterfall";
import { FeatureSpotlight } from "@/components/prediction/FeatureSpotlight";
import { SimilarHits } from "@/components/prediction/SimilarHits";
import { ArtistMore } from "@/components/prediction/ArtistMore";
import { SensitivitySliders } from "@/components/prediction/SensitivitySliders";
import { ShareCard } from "@/components/prediction/ShareCard";

function PredictResult() {
  const params = useSearchParams();
  const track = params.get("track") ?? "";
  const push = useHistory((s) => s.push);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["predict", track],
    queryFn: () => predictTrack(track),
    enabled: !!track,
  });

  useEffect(() => {
    if (data) push(data);
  }, [data, push]);

  if (!track) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-6 py-32 text-center">
        <SectionHeading
          align="center"
          kicker="Predict"
          title="Drop a track to begin"
        />
        <SearchInput />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <Spinner size={72} label="Reading the audio DNA…" />
        <div className="font-mono text-xs text-ink/40">
          fetching features · engineering · inference · SHAP
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-32 text-center">
        <h2 className="font-display text-3xl font-bold">Couldn’t analyze that one</h2>
        <p className="text-ink/60">
          The track link may be invalid or the service is unreachable. Try another.
        </p>
        <SearchInput />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* verdict + 3D EQ accent */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PredictionCard data={data} />
        </motion.div>
        <div className="pop-card relative hidden overflow-hidden lg:block">
          <Showcase
            name="eq"
            className="h-full w-full bg-ink"
            intensity={data.prediction.hit_probability}
          />
          <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-xs text-cream/60">
            reacting to {Math.round(data.prediction.hit_probability * 100)}%
          </div>
        </div>
      </div>

      {/* SHAP waterfall */}
      <section className="mt-12">
        <SectionHeading
          index="01"
          kicker="Explainability"
          title="Why the model said that"
          className="mb-6"
        />
        <div className="pop-card p-6 sm:p-8">
          <ShapWaterfall shap={data.shap} features={data.features} />
        </div>
      </section>

      {/* feature spotlight */}
      <section className="mt-12">
        <SectionHeading index="02" kicker="Top drivers" title="The features doing the work" className="mb-6" />
        <FeatureSpotlight data={data} />
      </section>

      {/* regional + sensitivity */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading index="03" kicker="By market" title="Regional scores" className="mb-6" />
          <div className="pop-card p-6">
            <RegionalScores scores={data.prediction.regional_scores} />
          </div>
        </div>
        <div>
          <SectionHeading index="04" kicker="Counterfactual" title="Tune it live" className="mb-6" />
          <SensitivitySliders data={data} />
        </div>
      </section>

      {/* similar hits */}
      <section className="mt-12">
        <SectionHeading index="05" kicker="Neighbours" title="Real hits with similar DNA" className="mb-6" />
        <SimilarHits hits={data.similar_hits} />
      </section>

      {/* more from the same artist */}
      {data.more_from_artist && data.more_from_artist.length > 0 && (
        <section className="mt-12">
          <SectionHeading
            index="06"
            kicker="Same artist"
            title={`More from ${data.track.artist}`}
            className="mb-6"
          />
          <ArtistMore tracks={data.more_from_artist} />
        </section>
      )}

      {/* share */}
      <section className="mt-12">
        <SectionHeading index="07" kicker="Share" title="Take it with you" className="mb-6" />
        <ShareCard data={data} />
      </section>

      <div className="mt-16 flex justify-center">
        <Button href="/compare" variant="mint">
          Compare it against another track →
        </Button>
      </div>
    </div>
  );
}

export default function PredictPage() {
  return (
    <main className="flex flex-col">
      <MarqueeStrip text="HIT PROBABILITY · SHAP BREAKDOWN · REGIONAL SCORES" tone="cobalt" />
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size={64} label="Loading…" />
          </div>
        }
      >
        <PredictResult />
      </Suspense>
    </main>
  );
}
