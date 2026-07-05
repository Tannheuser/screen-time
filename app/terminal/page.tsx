import { CheckCircle2 } from "lucide-react";

import { SessionCard } from "@/components/session";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasDatabaseEnv, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Session } from "inspector/promises";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };
  const user = data.user;
  const supabaseEnabled = hasSupabaseEnv();
  const databaseEnabled = hasDatabaseEnv();

  return (
    <main className="min-h-dvh  max-w-md text-emerald-400 border border-emerald-900/70 rounded-3xl m-4">
      <section className="">
        {/*<Card>
            <CardHeader>
              <CardTitle>
                {user ? "You are signed in" : "Sign in with Supabase"}
              </CardTitle>
              <CardDescription>
                {user
                  ? `Authenticated as ${user.email ?? "a Supabase user"}.`
                  : "Send a magic link email using the configured Supabase project."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  Your session is being read on the server through the Supabase
                  SSR client.
                </div>
              ) : (
                <AuthForm enabled={supabaseEnabled} />
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                Supabase env:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {supabaseEnabled ? "configured" : "missing"}
                </span>
              </p>
              <p>
                Database env:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {databaseEnabled ? "configured" : "missing"}
                </span>
              </p>
              {user ? (
                <form action="/auth/sign-out" method="post">
                  <Button type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              ) : null}
            </CardFooter>
          </Card>*/}
        <SessionCard
          recoveredDigits={[]}
          missionName="Math"
          agentName="Dany"
          totalTasks={4}
          completedTasks={2}
        />
      </section>
    </main>
  );
}
