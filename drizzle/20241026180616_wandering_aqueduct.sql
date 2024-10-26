ALTER TABLE "build" ALTER COLUMN "summon_materia" SET DATA TYPE uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build" ADD CONSTRAINT "build_summon_materia_materia_id_fk" FOREIGN KEY ("summon_materia") REFERENCES "public"."materia"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
