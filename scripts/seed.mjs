import { createCipheriv, createHash, randomBytes } from "node:crypto";
import nextEnv from "@next/env";
import postgres from "postgres";
import { z } from "zod";
import { TEMPORARY_PARENT_ID } from "../lib/temporary-parent.mjs";

nextEnv.loadEnvConfig(process.cwd());

const configSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SEED_PASSCODE: z.string().regex(/^\d{4}$/).default("7417"),
  PASSCODE_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/),
});

const config = configSchema.safeParse(process.env);
if (!config.success) {
  // Report names only: validation details can contain sensitive inputs.
  console.error(`Missing or invalid seed settings: ${config.error.issues.map((issue) => issue.path.join(".")).join(", ")}. See docs/seeding.md.`);
  process.exitCode = 1;
} else {
  const env = config.data;
  const client = postgres(env.DATABASE_URL, { prepare: false, max: 1, connect_timeout: 10 });
  try {
    const result = await client.begin(async (tx) => {
      const user = { id: TEMPORARY_PARENT_ID };
      await tx`INSERT INTO parents (id, display_name) VALUES (${user.id}, 'Demo Parent') ON CONFLICT (id) DO NOTHING`;
      // Serialize concurrent runs for this parent, including the no-session case.
      await tx`SELECT id FROM parents WHERE id = ${user.id} FOR UPDATE`;

      // A stable per-parent ID makes reruns safe even after the seed is completed.
      const bytes = createHash("sha256").update(`screen-time:blue-key-seed:${user.id}`).digest().subarray(0, 16);
      bytes[6] = (bytes[6] & 0x0f) | 0x80;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = bytes.toString("hex");
      const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      const [existing] = await tx`SELECT id FROM unlock_sessions WHERE id = ${id}`;
      if (existing) return { id: existing.id, created: false };
      const [active] = await tx`SELECT id FROM unlock_sessions WHERE parent_id = ${user.id} AND status = 'active'`;
      if (active) throw new Error("ACTIVE_SESSION_EXISTS");

      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", Buffer.from(env.PASSCODE_ENCRYPTION_KEY, "hex"), iv);
      const ciphertext = Buffer.concat([cipher.update(env.SEED_PASSCODE, "utf8"), cipher.final()]);
      const envelope = ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), ciphertext.toString("base64")].join(":");
      const startedAt = new Date(Date.now() - 10 * 60_000);
      await tx`INSERT INTO unlock_sessions (id, parent_id, title, passcode_ciphertext, created_at)
        VALUES (${id}, ${user.id}, 'Blue Key', ${envelope}, ${startedAt})`;
      const challenges = ["Math Sequence", "Pattern Lock", "Logic Gate", "Final Cipher"].map((title, index) => ({
        session_id: id,
        position: index + 1,
        title,
        started_at: index < 3 ? new Date(startedAt.getTime() + (index + 1) * 60_000) : null,
        completed_at: index < 2 ? new Date(startedAt.getTime() + (index + 1) * 120_000) : null,
      }));
      await tx`INSERT INTO session_challenges ${tx(challenges, "session_id", "position", "title", "started_at", "completed_at")}`;
      return { id, created: true };
    });
    console.log(`${result.created ? "Created Blue Key with four challenges (2 completed)" : "Seed session already exists; left unchanged"}. Session ID: ${result.id}`);
  } catch (error) {
    const messages = {
      ACTIVE_SESSION_EXISTS: "This parent already has another active session. No seed data was inserted.",
    };
    console.error(messages[error.message] ?? "Seed failed; transaction rolled back. Check database connectivity, migrations, and credentials.");
    process.exitCode = 1;
  } finally {
    await client.end({ timeout: 5 });
  }
}
