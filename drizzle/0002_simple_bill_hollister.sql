ALTER TABLE "session_challenges" ADD COLUMN "started_at" timestamp with time zone;--> statement-breakpoint
UPDATE "session_challenges"
SET "started_at" = "completed_at"
WHERE "completed_at" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "session_challenges" ADD CONSTRAINT "session_challenges_completion_requires_start_check" CHECK ("session_challenges"."completed_at" IS NULL OR "session_challenges"."started_at" IS NOT NULL);
