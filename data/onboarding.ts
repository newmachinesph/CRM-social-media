import type { OnboardingRecord } from "@/lib/types";

/** The canonical onboarding journey, in order. */
export const onboardingJourney = [
  "Welcome",
  "Agreement",
  "First Payment",
  "Business Details",
  "Brand Assets",
  "Social Accounts",
  "Strategy Questionnaire",
  "Kickoff Meeting",
  "Complete",
] as const;

export const onboardingRecords: OnboardingRecord[] = [
  {
    clientId: "bondi-wellness",
    startedDate: "2026-08-18",
    steps: [
      { label: "Welcome email sent", done: true },
      { label: "Client portal activated", done: true },
      { label: "Agreement signed", done: true },
      { label: "Deposit paid", done: true },
      { label: "Business questionnaire", done: true },
      { label: "Logo uploaded", done: true },
      { label: "Brand guidelines", done: false },
      { label: "Connect Instagram", done: false },
      { label: "Connect TikTok", done: false },
      { label: "Schedule kickoff", done: true },
    ],
  },
];
