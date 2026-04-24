// CONVICTION ENGINE v8.0 — FULL REPLACEMENT

export interface ArchDecisionProps {
  chosen: string;
  over: string;
  because: string;
  label?: string;
}

export interface TechBadgeProps {
  label: string;
  href?: string;
  variant?: 'default' | 'accent' | 'muted';
}

export interface ProjectCardProps {
  id: string;
  label: string;
  name: string;
  tagline: string;
  decision: ArchDecisionProps;
  outcomes: string[];
  techStack: string[];
  links: {
    demo?: string;
    github?: string;
    caseStudy?: string;
  };
  featured?: boolean;
}

export interface ProofColumnProps {
  label: string;
  body: string;
  index: number;
}

export interface OpenSourceCardProps {
  ecosystem: string;
  name: string;
  description: string;
  npmCommand: string;
  githubUrl: string;
  npmUrl: string;
}

export interface CertificationProps {
  name: string;
  date: string;
}

export interface ContactCardProps {
  title: string;
  body: string;
  accentColor: 'green' | 'blue' | 'purple';
}

export interface CommitTickerProps {
  githubUsername: string;
  repos: string[];
  staticCommits: Array<{ sha: string; message: string; date: string; repo: string }>;
}

export type RevealVariant = 'fade-up' | 'fade-in' | 'slide-right' | 'char-split';
