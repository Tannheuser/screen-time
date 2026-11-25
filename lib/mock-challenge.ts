export type MockQuestion = {
  prompt: string;
  options: string[];
};

export type MockChallenge = {
  position: number;
  title: string;
  questions: MockQuestion[];
};

const questions: MockQuestion[] = [
  {
    prompt: "Welk getal komt hierna? 4, 8, 12, 16, …",
    options: ["18", "20", "22", "24"],
  },
  {
    prompt: "Een team verzamelt 6 codes per ronde. Hoeveel codes hebben ze na 7 rondes?",
    options: ["36", "40", "42", "48"],
  },
  {
    prompt: "Welke breuk is even groot als 0,75?",
    options: ["1/4", "1/2", "3/4", "4/5"],
  },
  {
    prompt: "Een missie duurt 90 minuten. Hoeveel uur en minuten is dat?",
    options: ["1 uur", "1 uur en 15 minuten", "1 uur en 30 minuten", "2 uur"],
  },
];

export function getMockQuestions(): MockQuestion[] {
  return questions;
}
