import axios from "axios";
import type { PredictionResponse } from "./types";
import { mockPrediction } from "./mock";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** When no backend is configured, the app falls back to mock data so the UI
 *  works standalone. Flip USE_MOCK off by setting NEXT_PUBLIC_API_URL. */
const USE_MOCK = !BASE_URL;

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

function extractTrackId(input: string): string {
  // Accept full URL, URI, or bare ID.
  const m =
    input.match(/track[/:]([a-zA-Z0-9]+)/) ?? input.match(/^([a-zA-Z0-9]{16,})$/);
  return m ? m[1] : input.trim();
}

export async function predictTrack(
  spotifyUrl: string,
): Promise<PredictionResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900)); // simulate latency
    return mockPrediction(extractTrackId(spotifyUrl));
  }
  const { data } = await http.post<PredictionResponse>("/predict", {
    spotify_url: spotifyUrl,
  });
  return data;
}

export async function batchPredict(
  urls: string[],
): Promise<PredictionResponse[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900));
    return urls.map((u, i) => mockPrediction(extractTrackId(u), i));
  }
  const { data } = await http.post<{ results: PredictionResponse[] }>(
    "/batch-predict",
    { spotify_urls: urls },
  );
  return data.results;
}

export { extractTrackId, USE_MOCK };
