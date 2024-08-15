import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv-flow";
dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  migrations: {
    prefix: "supabase",
  },
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
