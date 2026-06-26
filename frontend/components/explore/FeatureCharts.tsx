"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  danceabilityDist,
  tempoHist,
  valenceScatter,
  GENRE_ERA_HEAT,
  type Era,
} from "@/lib/edaMock";

const tooltipStyle = {
  border: "2px solid #14181f",
  borderRadius: 12,
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  background: "#fff",
};

function ChartCard({
  title,
  finding,
  children,
}: {
  title: string;
  finding: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pop-card p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mb-4 mt-1 text-sm text-ink/60">{finding}</p>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

function heatColor(v: number) {
  // interpolate cream → cobalt by hit rate
  const t = Math.min(1, v / 0.4);
  const c1 = [251, 247, 236];
  const c2 = [26, 67, 224];
  const mix = c1.map((a, i) => Math.round(a + (c2[i] - a) * t));
  return `rgb(${mix[0]},${mix[1]},${mix[2]})`;
}

export function FeatureCharts({
  era,
  genre,
}: {
  era: Era;
  genre: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard
        title="The Danceability Threshold"
        finding="Hits cluster well above the non-hit mean — there’s a rhythmic floor to clear."
      >
        <ResponsiveContainer>
          <BarChart data={danceabilityDist(era)} barGap={0}>
            <CartesianGrid strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="bin" tick={{ fontSize: 10 }} interval={3} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="nonHits" name="non-hits" fill="#ff5a45" radius={[3, 3, 0, 0]} />
            <Bar dataKey="hits" name="hits" fill="#1a43e0" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Tempo Distribution of Hits"
        finding="A twin-peak around ~95 and ~122 BPM — the danceable and the driving."
      >
        <ResponsiveContainer>
          <BarChart data={tempoHist(era)}>
            <CartesianGrid strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="bpm" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" name="hit count" fill="#5fc9ab" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Valence vs Hit Rate"
        finding="The relationship isn’t linear — there’s a sweet spot, and it shifts by genre."
      >
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis
              type="number"
              dataKey="valence"
              name="valence"
              tick={{ fontSize: 10 }}
              domain={[0, 1]}
            />
            <YAxis
              type="number"
              dataKey="hitRate"
              name="hit rate"
              tick={{ fontSize: 10 }}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={valenceScatter(genre)} fill="#1a43e0" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Genre × Era Hit Rate"
        finding="Hip-Hop rose as Rock fell — the heatmap tells the streaming-era story."
      >
        <div className="flex h-full flex-col justify-center">
          <div className="flex">
            <div className="w-20" />
            {GENRE_ERA_HEAT.eras.map((e) => (
              <div key={e} className="flex-1 text-center font-mono text-[10px]">
                {e}
              </div>
            ))}
          </div>
          {GENRE_ERA_HEAT.genres.map((g, gi) => (
            <div key={g} className="flex items-center">
              <div className="w-20 font-mono text-[11px]">{g}</div>
              {GENRE_ERA_HEAT.matrix[gi].map((v, ei) => (
                <div
                  key={ei}
                  className="m-0.5 flex flex-1 items-center justify-center rounded border border-ink/20 py-3 text-[10px] font-bold"
                  style={{
                    background: heatColor(v),
                    color: v > 0.25 ? "#fff" : "#14181f",
                  }}
                >
                  {Math.round(v * 100)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
