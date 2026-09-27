import type { Achievement } from "./types";

/**
 * Certifications, hackathons, awards, workshops, publications.
 * Only real items with, ideally, a verification link. The section hides
 * itself when this list is empty.
 *
 * The entries below are TEMPLATES. Replace them or delete them.
 */
export const achievements: Achievement[] = [
  {
    title: "Certification Name",
    issuer: "Issuing Organization",
    kind: "Certification",
    date: "2025",
    description: "TODO: what it covered, in one line.",
    // link: "https://credential-url",
  },
  {
    title: "Hackathon Name",
    issuer: "Organizer",
    kind: "Hackathon",
    date: "2024",
    description: "TODO: what you built and how the team placed (only if true).",
  },
  {
    title: "Workshop / Bootcamp Name",
    issuer: "Organizer",
    kind: "Workshop",
    date: "2024",
    description: "TODO: topic and what you took away.",
  },
];
