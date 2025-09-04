import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, {
  max: 1,
  ssl: "require",
});

export const db = drizzle(sql, { schema });
