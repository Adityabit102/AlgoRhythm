import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in the home dir isn't picked up.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" }, // Spotify album art
      { protocol: "https", hostname: "image-cdn-*.spotifycdn.com" },
    ],
  },
};

export default nextConfig;
