import { achievements } from "./achievements";
import { education } from "./education";
import { experience } from "./experience";
import { about, profile, socials } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import type { NavItem } from "./types";

export { about, achievements, education, experience, profile, projects, skillGroups, socials };
export type * from "./types";

/** Which optional sections have content. Empty sections are hidden along with their nav link. */
export const sectionsEnabled = {
  experience: experience.length > 0,
  achievements: achievements.length > 0,
  github: profile.githubUsername.trim().length > 0,
};

/** Every page section in order, including ones that aren't in the nav. */
const sectionOrder = [
  "about",
  "skills",
  "projects",
  ...(sectionsEnabled.experience ? ["experience"] : []),
  "education",
  ...(sectionsEnabled.achievements ? ["achievements"] : []),
  ...(sectionsEnabled.github ? ["github"] : []),
  "contact",
];

/** Two-digit number shown in a section's eyebrow, e.g. "03". */
export function sectionIndex(id: string): string {
  return String(sectionOrder.indexOf(id) + 1).padStart(2, "0");
}

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  ...(sectionsEnabled.experience ? [{ id: "experience", label: "Experience" }] : []),
  { id: "education", label: "Education" },
  ...(sectionsEnabled.achievements ? [{ id: "achievements", label: "Achievements" }] : []),
  { id: "contact", label: "Contact" },
];
