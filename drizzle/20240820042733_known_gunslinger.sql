DROP TABLE "schema";--> statement-breakpoint
ALTER TABLE "build" DROP CONSTRAINT "build_weapon_schema_schema_id_fk";
--> statement-breakpoint
ALTER TABLE "build" DROP CONSTRAINT "build_armor_schema_schema_id_fk";
--> statement-breakpoint
ALTER TABLE "build" ALTER COLUMN "accessory" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "build" ALTER COLUMN "weapon_schema" SET DATA TYPE slot_type[];--> statement-breakpoint
ALTER TABLE "build" ALTER COLUMN "armor_schema" SET DATA TYPE slot_type[];--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "leader" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "second" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "game";--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "description";