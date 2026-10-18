import type { TeamMember } from "@/lib/types";

export const team: TeamMember[] = [
  {
    id: "olivia",
    name: "Olivia Chen",
    role: "Account Director",
    email: "olivia@northstarsocial.com.au",
    initials: "OC",
    color: "bg-indigo-500",
  },
  {
    id: "james",
    name: "James Park",
    role: "Content Strategist",
    email: "james@northstarsocial.com.au",
    initials: "JP",
    color: "bg-sky-500",
  },
  {
    id: "mia",
    name: "Mia Thompson",
    role: "Senior Designer",
    email: "mia@northstarsocial.com.au",
    initials: "MT",
    color: "bg-rose-500",
  },
  {
    id: "ethan",
    name: "Ethan Walsh",
    role: "Video Editor",
    email: "ethan@northstarsocial.com.au",
    initials: "EW",
    color: "bg-emerald-500",
  },
  {
    id: "chloe",
    name: "Chloe Martin",
    role: "Paid Media Specialist",
    email: "chloe@northstarsocial.com.au",
    initials: "CM",
    color: "bg-amber-500",
  },
  {
    id: "daniel",
    name: "Daniel Cooper",
    role: "Founder",
    email: "daniel@northstarsocial.com.au",
    initials: "DC",
    color: "bg-violet-500",
  },
];

export const teamById = Object.fromEntries(team.map((t) => [t.id, t]));

export function member(id: string): TeamMember {
  return teamById[id] ?? team[0];
}
