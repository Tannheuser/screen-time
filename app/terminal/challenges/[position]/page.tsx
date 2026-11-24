import { notFound } from "next/navigation";

import { MockChallengeScreen } from "@/components/mock-challenge";
import { getMockChallenge } from "@/lib/mock-challenge";

type ChallengePageProps = {
  params: Promise<{ position: string }>;
};

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { position: positionParam } = await params;
  const position = Number(positionParam);
  const challenge = Number.isInteger(position)
    ? getMockChallenge(position)
    : null;

  if (!challenge) notFound();

  return <MockChallengeScreen challenge={challenge} />;
}
