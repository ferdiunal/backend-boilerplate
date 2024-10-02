import { env } from "@/config/env";
import type { Config } from "drizzle-kit";

export default {
  schemaFilter: ["public", "auth"],
  dialect: "postgresql",
  schema: "./src/models/index.ts",
  out: "./supabase/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  breakpoints: true,
  introspect: {
    casing: "preserve",
  },
  strict: true,
  migrations: {
    table: "migrations",
    schema: "public",
    prefix: "timestamp",
  },
} satisfies Config;
