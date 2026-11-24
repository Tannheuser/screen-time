import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getEnv, hasDatabaseEnv } from "@/lib/env";
import * as schema from "@/lib/db/schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function createDb() {
  if (database) return database;
  if (!hasDatabaseEnv()) {
    return null;
  }

  const client = postgres(getEnv().DATABASE_URL!, {
    prepare: false,
  });

  database = drizzle(client, { schema });
  return database;
}

export { schema };
