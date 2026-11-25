export type ChallengeStatus =
  | "not_started"
  | "in_progress"
  | "completed";

type ChallengeTimestamps = {
  startedAt: Date | null;
  completedAt: Date | null;
};

export function deriveChallengeStatus({
  startedAt,
  completedAt,
}: ChallengeTimestamps): ChallengeStatus {
  if (completedAt !== null) return "completed";
  if (startedAt !== null) return "in_progress";
  return "not_started";
}

export function deriveMissionStatus(
  challengeStatuses: readonly ChallengeStatus[],
): ChallengeStatus {
  if (
    challengeStatuses.length > 0 &&
    challengeStatuses.every((status) => status === "completed")
  ) {
    return "completed";
  }

  if (challengeStatuses.some((status) => status !== "not_started")) {
    return "in_progress";
  }

  return "not_started";
}

export function formatChallengeStatus(status: ChallengeStatus): string {
  const labels: Record<ChallengeStatus, string> = {
    not_started: "Not started",
    in_progress: "In progress",
    completed: "Completed",
  };

  return labels[status];
}
