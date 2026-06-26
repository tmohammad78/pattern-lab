import fs from "fs";
import path from "path";
import { kv } from "@vercel/kv";
import type { UserProgress } from "./types";

const PROGRESS_DIR = path.join(process.cwd(), "data", "progress");
const KEY_PREFIX = "pattern-lab:progress:";

function progressKey(userId: string): string {
  return `${KEY_PREFIX}${userId.toLowerCase()}`;
}

function filePath(userId: string): string {
  const safe = userId.toLowerCase().replace(/[^a-z0-9@._-]/g, "_");
  return path.join(PROGRESS_DIR, `${safe}.json`);
}

function hasKv(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

function readFromFile(userId: string): UserProgress | null {
  const fp = filePath(userId);
  if (!fs.existsSync(fp)) return null;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as UserProgress;
  } catch {
    return null;
  }
}

function writeToFile(progress: UserProgress): void {
  fs.mkdirSync(PROGRESS_DIR, { recursive: true });
  fs.writeFileSync(
    filePath(progress.userId),
    JSON.stringify(progress, null, 2),
    "utf-8"
  );
}

export async function loadProgressFromStore(
  userId: string
): Promise<UserProgress | null> {
  if (hasKv()) {
    try {
      return (await kv.get<UserProgress>(progressKey(userId))) ?? null;
    } catch (error) {
      console.error("KV load failed, falling back to file:", error);
    }
  }

  return readFromFile(userId);
}

export async function saveProgressToStore(
  progress: UserProgress
): Promise<void> {
  const payload: UserProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };

  if (hasKv()) {
    try {
      await kv.set(progressKey(progress.userId), payload);
      return;
    } catch (error) {
      console.error("KV save failed, falling back to file:", error);
    }
  }

  writeToFile(payload);
}

export function isProgressStoreConfigured(): boolean {
  return hasKv() || process.env.NODE_ENV === "development";
}
