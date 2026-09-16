CREATE TYPE "public"."unlock_session_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "parents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "session_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"position" smallint NOT NULL,
	"title" text NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "session_challenges_position_check" CHECK ("session_challenges"."position" BETWEEN 1 AND 4)
);
--> statement-breakpoint
ALTER TABLE "session_challenges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "unlock_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid NOT NULL,
	"title" text NOT NULL,
	"passcode_ciphertext" text NOT NULL,
	"status" "unlock_session_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "unlock_sessions_completion_check" CHECK (("unlock_sessions"."status" = 'completed') = ("unlock_sessions"."completed_at" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "unlock_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_challenges" ADD CONSTRAINT "session_challenges_session_id_unlock_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."unlock_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unlock_sessions" ADD CONSTRAINT "unlock_sessions_parent_id_parents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "session_challenges_session_position_idx" ON "session_challenges" USING btree ("session_id","position");--> statement-breakpoint
CREATE INDEX "unlock_sessions_parent_id_idx" ON "unlock_sessions" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unlock_sessions_one_active_per_parent_idx" ON "unlock_sessions" USING btree ("parent_id") WHERE "unlock_sessions"."status" = 'active';