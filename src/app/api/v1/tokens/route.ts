import { NextResponse } from "next/server";
import { demoTokens } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export function GET() {
  const demoMode = isDemoMode();
  return NextResponse.json({
    data: demoMode ? demoTokens : [],
    meta: {
      source: demoMode ? "DEMO" : "INDEXER",
      demoMode,
      asOf: demoMode ? null : new Date().toISOString(),
      asOfSlot: null,
      stale: !demoMode,
    },
  });
}
