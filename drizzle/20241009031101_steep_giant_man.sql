ALTER TABLE "party" DROP CONSTRAINT "party_leader_build_id_fk";
--> statement-breakpoint
ALTER TABLE "party" DROP CONSTRAINT "party_second_build_id_fk";
--> statement-breakpoint
ALTER TABLE "party" DROP CONSTRAINT "party_third_build_id_fk";
--> statement-breakpoint
ALTER TABLE "party" ADD COLUMN "builds" uuid[] NOT NULL;--> statement-breakpoint
ALTER TABLE "party" DROP COLUMN IF EXISTS "leader";--> statement-breakpoint
ALTER TABLE "party" DROP COLUMN IF EXISTS "second";--> statement-breakpoint
ALTER TABLE "party" DROP COLUMN IF EXISTS "third";