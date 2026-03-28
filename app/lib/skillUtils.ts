// PRD Feature 3: Skill-002 - Utility functions for D3.js force graph
import type { Skill } from "./constants";

// PRD: Category color mapping (5 categories)
export const CATEGORY_COLORS = {
  ml: "#00D9FF", // Accent primary (cyan)
  backend: "#10B981", // Green
  frontend: "#8B5CF6", // Purple
  devops: "#F59E0B", // Amber
  blockchain: "#EC4899", // Pink
} as const;

export const CATEGORY_LABELS = {
  ml: "ML & AI",
  backend: "Backend",
  frontend: "Frontend",
  devops: "DevOps",
  blockchain: "Blockchain",
} as const;

// D3.js node interface
export interface GraphNode {
  id: string;
  name: string;
  category: Skill["category"];
  proficiency: Skill["proficiency"];
  yearsOfExperience: number;
  projects: string[];
  relatedSkills?: string[];
  // D3 simulation properties (added during simulation)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

// D3.js link interface
export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

// PRD: Generate D3 links from relatedSkills array
export function generateSkillLinks(skills: Skill[]): GraphLink[] {
  const links: GraphLink[] = [];
  const skillIds = new Set(skills.map((s) => s.id));

  skills.forEach((skill) => {
    skill.relatedSkills?.forEach((relatedId) => {
      // Only create link if both skills exist and avoid duplicates
      if (
        skillIds.has(relatedId) &&
        !links.some(
          (l) =>
            (l.source === skill.id && l.target === relatedId) ||
            (l.source === relatedId && l.target === skill.id)
        )
      ) {
        links.push({ source: skill.id, target: relatedId });
      }
    });
  });

  return links;
}

// Convert Skill[] to GraphNode[]
export function skillsToNodes(skills: Skill[]): GraphNode[] {
  return skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
    yearsOfExperience: skill.yearsOfExperience,
    projects: skill.projects,
    relatedSkills: skill.relatedSkills,
  }));
}

// Get node radius based on proficiency
export function getNodeRadius(proficiency: Skill["proficiency"]): number {
  switch (proficiency) {
    case "expert":
      return 24;
    case "advanced":
      return 18;
    case "proficient":
      return 14;
    default:
      return 16;
  }
}

// Get proficiency label
export function getProficiencyLabel(
  proficiency: Skill["proficiency"]
): string {
  return proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
}
