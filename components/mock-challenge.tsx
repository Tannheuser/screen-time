"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, RotateCcw } from "lucide-react";

import type { MockChallenge } from "@/lib/mock-challenge";

type MockChallengeScreenProps = {
  challenge: MockChallenge;
};

export function MockChallengeScreen({ challenge }: MockChallengeScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const question = challenge.questions[questionIndex];
  const progress = isFinished
    ? 100
    : (questionIndex / challenge.questions.length) * 100;

  function continueChallenge() {
    if (!selectedOption) return;

    if (questionIndex === challenge.questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelectedOption(null);
  }

  function restartChallenge() {
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsFinished(false);
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-5.75rem)] w-full max-w-md flex-col">
      <div className="glass-panel flex flex-1 flex-col rounded-3xl p-5">
        <header className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/70">
                Challenge {String(challenge.position).padStart(2, "0")}
              </p>
              <h1 className="neon-text mt-3 font-mono text-3xl font-semibold uppercase tracking-[0.14em]">
                {challenge.title}
              </h1>
              <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-cyan-100/70">
                Status: {isFinished ? "completed" : "in progress"}
              </p>
            </div>

            <Link
              href="/terminal"
              aria-label="Back to mission overview"
              title="Back to mission overview"
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/5 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <ArrowLeft className="size-7" />
            </Link>
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
            <span>Challenge Progress</span>
            <span>
              {isFinished ? challenge.questions.length : questionIndex + 1} / {challenge.questions.length}
            </span>
          </div>

          <div className="h-3 rounded-full border border-cyan-200/20 bg-black/30 p-0.5">
            <div
              className="h-full rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isFinished ? (
          <div className="mt-5 flex flex-1 flex-col rounded-2xl border border-white/10 bg-transparent p-4">
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <div className="flex size-20 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.18)]">
                <Check className="size-10 text-cyan-200" />
              </div>
              <h2 className="neon-text mt-6 font-mono text-2xl uppercase tracking-[0.14em]">
                Training complete
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-cyan-100/60">
                Goed gedaan! Dit is een demo, dus je missievoortgang is niet opgeslagen.
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3">
              <Link
                href="/terminal"
                className="neon-border flex w-full items-center justify-between rounded-xl border bg-cyan-300/10 px-5 py-4 font-mono text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/15"
              >
                Back to mission
                <ChevronRight className="size-5" />
              </Link>
              <button
                type="button"
                onClick={restartChallenge}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200/60 transition hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
              >
                <RotateCcw className="size-4" />
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-1 flex-col rounded-2xl border border-white/10 bg-transparent p-4">
            <h2 className="text-xl font-medium leading-8 text-cyan-50">
              {question.prompt}
            </h2>

            <div className="mt-7 grid gap-3" role="radiogroup" aria-label="Answer options">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === option;

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedOption(option)}
                    className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${
                      isSelected
                        ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                        : "border-white/10 bg-white/2.5 text-cyan-100/75 hover:border-cyan-300/30 hover:bg-cyan-300/5"
                    }`}
                  >
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border font-mono text-xs ${
                      isSelected
                        ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                        : "border-white/15 text-cyan-200/50"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedOption}
              onClick={continueChallenge}
              className="neon-border mt-auto flex w-full items-center justify-between rounded-xl border bg-cyan-300/10 px-5 py-4 font-mono text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/2.5 disabled:text-white/25 disabled:shadow-none"
            >
              {questionIndex === challenge.questions.length - 1 ? "Complete training" : "Next question"}
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
