"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

type AuthFormProps = {
  enabled: boolean;
};

export function AuthForm({ enabled }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsed = signInSchema.safeParse({ email });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!enabled || !supabase) {
      setError("Add Supabase environment variables to enable sign-in.");
      return;
    }

    setIsPending(true);

    const redirectTo = new URL("/auth/callback", window.location.origin).toString();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setIsPending(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setMessage("Check your inbox for the magic link.");
    setEmail("");
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm font-medium">Email</span>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          disabled={isPending}
          autoComplete="email"
        />
      </label>
      <Button className="w-full" type="submit" disabled={!enabled || isPending}>
        {isPending ? "Sending magic link..." : "Send magic link"}
      </Button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {message ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
      ) : null}
    </form>
  );
}
