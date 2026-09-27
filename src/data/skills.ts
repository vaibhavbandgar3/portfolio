import { BarChart3, BrainCircuit, Code2, Database, Globe, Wrench } from "lucide-react";
import type { SkillGroup } from "./types";

/**
 * TODO: keep only skills you can talk about confidently in an interview.
 * Order within a group = order shown. Put your strongest first.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    title: "Programming",
    description: "Languages I write day to day.",
    icon: Code2,
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C++", "SQL"],
  },
  {
    id: "web",
    title: "Web Development",
    description: "Building interfaces and the APIs behind them.",
    icon: Globe,
    skills: ["React", "Next.js", "Node.js", "Express", "HTML", "CSS", "Tailwind CSS", "REST APIs"],
  },
  {
    id: "data",
    title: "Data & Analytics",
    description: "Cleaning, exploring and explaining data.",
    icon: BarChart3,
    skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Power BI", "Excel", "Jupyter"],
  },
  {
    id: "ml",
    title: "Machine Learning / AI",
    description: "Classical ML and applied deep learning.",
    icon: BrainCircuit,
    skills: ["scikit-learn", "TensorFlow", "Keras", "NLP basics", "Model evaluation", "LLM APIs"],
  },
  {
    id: "databases",
    title: "Databases",
    description: "Relational and document stores.",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    description: "What I build and ship with.",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Linux", "Docker", "Vercel", "Postman"],
  },
];
