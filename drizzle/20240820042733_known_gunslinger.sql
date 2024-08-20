DROP TABLE "schema";--> statement-breakpoint
ALTER TABLE "build" ALTER COLUMN "accessory" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "leader" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "party" ALTER COLUMN "second" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "game";--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "build" DROP COLUMN IF EXISTS "description";
ALTER TABLE "build" ADD COLUMN "weapon_schema" slot_type[] NOT NULL;--> statement-breakpoint
ALTER TABLE "build" ADD COLUMN "armor_schema" slot_type[] NOT NULL;--> statement-breakpoint