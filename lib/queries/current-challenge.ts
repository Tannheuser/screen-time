import "server-only";

import { and, eq } from "drizzle-orm";

import {
  deriveChallengeStatus,
  type ChallengeStatus,
} from "@/lib/challenges/status";
import { createDb } from "@/lib/db";
import { sessionChallenges, unlockSessions } from "@/lib/db/schema";
import { TEMPORARY_PARENT_ID } from "@/lib/temporary-parent.mjs";

export type CurrentChallenge = {
  position: number;
  title: string;
  status: ChallengeStatus;
};

export async function getCurrentChallenge(
  challengeId: string,
): Promise<CurrentChallenge | null> {
  const db = createDb();
  if (!db) return null;

  const [row] = await db
    .select({
      position: sessionChallenges.position,
      title: sessionChallenges.title,
      startedAt: sessionChallenges.startedAt,
      completedAt: sessionChallenges.completedAt,
    })
    .from(sessionChallenges)
    .innerJoin(
      unlockSessions,
      eq(unlockSessions.id, sessionChallenges.sessionId),
    )
    .where(
      and(
        eq(unlockSessions.parentId, TEMPORARY_PARENT_ID),
        eq(unlockSessions.status, "active"),
        eq(sessionChallenges.id, challengeId),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    position: row.position,
    title: row.title,
    status: deriveChallengeStatus(row),
  };
}
