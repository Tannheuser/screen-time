import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getEnv, hasDatabaseEnv } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export function createDb() {
  if (!hasDatabaseEnv()) {
    return null;
  }

  const client = postgres(getEnv().DATABASE_URL!, {
    prepare: false,
  });

  return drizzle(client, { schema });
}

export { schema };
