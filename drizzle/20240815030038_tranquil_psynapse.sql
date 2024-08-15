DO $$ BEGIN
 CREATE TYPE "public"."character" AS ENUM('cloud', 'barret', 'tifa', 'aerith', 'red-xiii', 'yuffie', 'cait-sith', 'cid', 'vincent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."game" AS ENUM('og', 'remake', 'rebirth');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."materia_type" AS ENUM('red', 'yellow', 'green', 'blue', 'purple');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."slot_type" AS ENUM('single', 'double');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
