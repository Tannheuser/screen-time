import { notFound } from "next/navigation";
import { z } from "zod";

import { MockChallengeScreen } from "@/app/terminal/_components/mock-challenge-screen";
import { getMockQuestions, type MockChallenge } from "@/lib/mock-challenge";
import { getCurrentChallenge } from "@/lib/queries/current-challenge";

type ChallengePageProps = {
  params: Promise<{ challengeId: string }>;
};

const challengeIdSchema = z.uuid();

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { challengeId: challengeIdParam } = await params;
  const parsedChallengeId = challengeIdSchema.safeParse(challengeIdParam);

  if (!parsedChallengeId.success) notFound();

  const currentChallenge = await getCurrentChallenge(parsedChallengeId.data);

  if (!currentChallenge) notFound();

  const challenge: MockChallenge = {
    position: currentChallenge.position,
    title: currentChallenge.title,
    questions: getMockQuestions(),
  };

  return (
    <MockChallengeScreen
      challenge={challenge}
      initialStatus={currentChallenge.status}
    />
  );
}
