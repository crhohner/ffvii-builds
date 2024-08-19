import { drizzle } from "drizzle-orm/postgres-js";
import { createClient } from "@supabase/supabase-js";

import postgres from "postgres";

const connectionString = process.env.DB_URL;
const client = postgres(connectionString!);
export const db = drizzle(client);
//for local stuff..? ask when to use this because will make auth harder..
