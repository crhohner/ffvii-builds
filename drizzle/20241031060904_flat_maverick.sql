CREATE TABLE IF NOT EXISTS "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schema" slot_type[] NOT NULL,
	"game" "game" NOT NULL,
	"character" "character"
);
