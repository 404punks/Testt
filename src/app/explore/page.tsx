import type { Metadata } from "next";
import { ExplorePage } from "@/components/explore-page";
import { demoTokens } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/runtime";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore verified living tokens and their public AI Brain activity.",
};

export default function Page() {
  const demoMode = isDemoMode();
  return <ExplorePage demoMode={demoMode} tokens={demoMode ? demoTokens : []} />;
}
