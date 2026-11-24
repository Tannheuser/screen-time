import "server-only";

import { createDecipheriv } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { createDb } from "@/lib/db";
import { sessionChallenges, unlockSessions } from "@/lib/db/schema";
import { TEMPORARY_PARENT_ID } from "@/lib/temporary-parent.mjs";

export async function getCurrentSession() {
  const db = createDb();
  if (!db) return null;
  const rows = await db.select({
    id: unlockSessions.id,
    title: unlockSessions.title,
    ciphertext: unlockSessions.passcodeCiphertext,
    challengeId: sessionChallenges.id,
    challengeTitle: sessionChallenges.title,
    position: sessionChallenges.position,
    startedAt: sessionChallenges.startedAt,
    completedAt: sessionChallenges.completedAt,
  }).from(unlockSessions)
    .innerJoin(sessionChallenges, eq(sessionChallenges.sessionId, unlockSessions.id))
    .where(and(eq(unlockSessions.parentId, TEMPORARY_PARENT_ID), eq(unlockSessions.status, "active")))
    .orderBy(asc(sessionChallenges.position));
  if (!rows.length) return null;

  const key = process.env.PASSCODE_ENCRYPTION_KEY;
  if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) throw new Error("Passcode encryption key is not configured.");
  const [version, iv, tag, ciphertext] = rows[0].ciphertext.split(":");
  if (version !== "v1" || !iv || !tag || !ciphertext) throw new Error("Invalid passcode envelope.");
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const passcode = Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]).toString("utf8");
  if (!/^\d{4}$/.test(passcode)) throw new Error("Invalid stored passcode.");

  const completedTasks = rows.filter((row) => row.completedAt !== null).length;
  return {
    id: rows[0].id,
    title: rows[0].title,
    completedTasks,
    totalTasks: 4,
    digits: Array.from({ length: 4 }, (_, index) =>
      rows.some((row) => row.position === index + 1 && row.completedAt !== null)
        ? passcode[index]
        : null,
    ),
    challenges: rows.map((row) => ({
      id: row.challengeId,
      position: row.position,
      title: row.challengeTitle,
      status: row.completedAt
        ? "Completed"
        : row.startedAt
          ? "In progress"
          : "Not started",
    })),
  };
}
