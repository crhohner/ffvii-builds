CREATE TABLE IF NOT EXISTS "accessory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"games" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "build" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid NOT NULL,
	"game" "game" NOT NULL,
	"character" "character" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"accessory" uuid NOT NULL,
	"weapon_schema" uuid NOT NULL,
	"armor_schema" uuid NOT NULL,
	"weapon_materia" text[] NOT NULL,
	"armor_materia" text[] NOT NULL,
	"summon_materia" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"materia_type" "materia_type" NOT NULL,
	"games" game[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materia_link" (
	"blue_id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	CONSTRAINT "materia_link_blue_id_target_id_pk" PRIMARY KEY("blue_id","target_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "party" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid NOT NULL,
	"game" "game" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"leader" uuid NOT NULL,
	"second" uuid NOT NULL,
	"third" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user" uuid NOT NULL,
	"name" text NOT NULL,
	"slots" slot_type[] NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build" ADD CONSTRAINT "build_accessory_accessory_id_fk" FOREIGN KEY ("accessory") REFERENCES "public"."accessory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build" ADD CONSTRAINT "build_weapon_schema_schema_id_fk" FOREIGN KEY ("weapon_schema") REFERENCES "public"."schema"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "build" ADD CONSTRAINT "build_armor_schema_schema_id_fk" FOREIGN KEY ("armor_schema") REFERENCES "public"."schema"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materia_link" ADD CONSTRAINT "materia_link_blue_id_materia_id_fk" FOREIGN KEY ("blue_id") REFERENCES "public"."materia"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "materia_link" ADD CONSTRAINT "materia_link_target_id_materia_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."materia"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
