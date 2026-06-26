import { NextResponse } from "next/server";
import { loadProgressFromStore, saveProgressToStore } from "@/lib/progress-store";
import type { UserProgress } from "@/lib/types";

function isValidUserId(userId: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (!isValidUserId(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  const progress = await loadProgressFromStore(userId);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  let body: { userId?: string; progress?: UserProgress };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = body.userId?.trim();
  const progress = body.progress;

  if (!userId || !progress) {
    return NextResponse.json(
      { error: "userId and progress are required" },
      { status: 400 }
    );
  }

  if (!isValidUserId(userId)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  if (progress.userId.toLowerCase() !== userId.toLowerCase()) {
    return NextResponse.json({ error: "userId mismatch" }, { status: 400 });
  }

  await saveProgressToStore({ ...progress, userId: userId.toLowerCase() });
  return NextResponse.json({ ok: true });
}
