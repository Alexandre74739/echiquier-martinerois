import { type NextRequest, NextResponse } from "next/server";
import {
  fetchPuzzleByLevel,
  fetchDailyPuzzle,
  type NiveauPuzzle,
} from "@/src/lib/lichess";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const niveau = searchParams.get("niveau") as NiveauPuzzle | null;
  const daily = searchParams.get("daily") === "1";

  const puzzle = daily
    ? await fetchDailyPuzzle()
    : await fetchPuzzleByLevel(niveau ?? "débutant");

  if (!puzzle) {
    return NextResponse.json({ puzzle: null }, { status: 502 });
  }

  return NextResponse.json(
    { puzzle },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
