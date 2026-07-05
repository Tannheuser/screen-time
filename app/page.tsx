import { CheckCircle2 } from "lucide-react";

import { AuthForm } from "@/components/auth-form";
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

const stack = [
  "Next.js App Router",
  "TypeScript",
  "Supabase Auth",
  "Postgres",
  "Drizzle ORM",
  "Tailwind CSS",
  "shadcn/ui style components",
  "Zod",
  "Vercel Analytics",
];

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const user = data.user;
  const supabaseEnabled = hasSupabaseEnv();
  const databaseEnabled = hasDatabaseEnv();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12 md:px-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="px-0">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Production-ready starter
            </p>
            <CardTitle className="max-w-2xl text-4xl leading-tight md:text-5xl">
              Next.js + Supabase Auth + Drizzle on Postgres.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base md:text-lg">
              A compact starter for building authenticated apps on Vercel with
              typed validation and a Tailwind-powered UI foundation.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-0 sm:grid-cols-2">
            {stack.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <CheckCircle2 className="size-5 text-emerald-600" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{user ? "You are signed in" : "Sign in with Supabase"}</CardTitle>
            <CardDescription>
              {user
                ? `Authenticated as ${user.email ?? "a Supabase user"}.`
                : "Send a magic link email using the configured Supabase project."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                Your session is being read on the server through the Supabase SSR client.
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
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supabase Auth</CardTitle>
            <CardDescription>
              Browser and server clients are pre-wired for the App Router.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Drizzle ORM</CardTitle>
            <CardDescription>
              Postgres schema and configuration are ready for migrations.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zod validation</CardTitle>
            <CardDescription>
              Environment parsing and auth form validation use typed schemas.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
}
