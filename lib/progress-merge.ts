import type { UserProgress } from "./types";

export function mergeProgress(
  local: UserProgress,
  remote: UserProgress
): UserProgress {
  const localTime = local.updatedAt ?? "";
  const remoteTime = remote.updatedAt ?? "";

  if (localTime && remoteTime) {
    return localTime >= remoteTime ? local : remote;
  }

  if (remoteTime) return remote;
  if (localTime) return local;

  return local.xp >= remote.xp ? local : remote;
}
