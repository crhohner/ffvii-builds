ALTER TABLE "build" RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE "party" RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE "party" DROP CONSTRAINT "party_leader_build_user_id_fk";
--> statement-breakpoint
ALTER TABLE "party" DROP CONSTRAINT "party_second_build_user_id_fk";
--> statement-breakpoint
ALTER TABLE "party" DROP CONSTRAINT "party_third_build_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "party" ADD CONSTRAINT "party_leader_build_id_fk" FOREIGN KEY ("leader") REFERENCES "public"."build"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "party" ADD CONSTRAINT "party_second_build_id_fk" FOREIGN KEY ("second") REFERENCES "public"."build"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "party" ADD CONSTRAINT "party_third_build_id_fk" FOREIGN KEY ("third") REFERENCES "public"."build"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
