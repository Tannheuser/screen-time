ALTER TABLE "parents" DROP CONSTRAINT "parents_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "parents" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();