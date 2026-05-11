/**
 * lib/types/index.ts
 *
 * SINGLE SOURCE OF TRUTH for all shared types across the portfolio.
 *
 * Dependency direction:
 *   lib/types/index.ts
 *     ↑ imported by
 *   lib/data/*.ts  AND  components/**\/*.tsx
 *
 * Neither data files nor components may import types FROM each other.
 * All cross-boundary types live here.
 */

// ─── Metric provenance ────────────────────────────────────────────────────────

/**
 * Every displayed metric must carry exactly one badge.
 *
 * live        — connected to a live data source (e.g. GitHub API)
 * documented  — sourced from a blog post, case study, or repo artifact
 * backtested  — historical evaluation only; UI must be explicit about the source
 * snapshot    — point-in-time measurement; UI must include month/year
 */
export type BadgeType = 'live' | 'documented' | 'backtested' | 'snapshot'

// ─── System identity ──────────────────────────────────────────────────────────

export type SystemId =
  | 'sabiscore'
  | 'taxbridge'
  | 'swarmxq'
  | 'hashablanca'
  | 'ubec'
  | 'portfolio'   // v25: added — portfolio site is a production system, used in SkillTag tracing

// ─── Compliance tags ──────────────────────────────────────────────────────────

/**
 * Every tag must be defensible in a technical interview.
 * Do not add a tag you cannot explain in detail when asked.
 */
export type ComplianceTag =
  | 'GDPR'
  | 'PCI-DSS'
  | 'Audit Trail'
  | 'Multi-tenant RLS'
  | 'ZK Privacy'
  | 'KYC/AML'
  | 'CBOR'
  | 'Sepolia Verified'

// ─── Skills taxonomy ──────────────────────────────────────────────────────────

export type SkillPillar =
  | 'ML & AI'
  | 'Backend & APIs'
  | 'Fintech & Compliance'
  | 'Data & Storage'
  | 'DevOps & SRE'
  | 'Frontend & Full-Stack'
  | 'AI Agent Orchestration'
  | 'Blockchain & Web3'

/**
 * Skill context tags.
 * Every skill must have at least one `used-in:system-name` tag
 * so reviewers can trace the skill to a production system.
 */
export type SkillTag =
  | `used-in:${SystemId}`
  | 'documented'
  | 'certified'

export type SkillLevel = 'foundational' | 'proficient' | 'expert'

export interface SkillNode {
  id:     string
  name:   string
  pillar: SkillPillar
  tags:   SkillTag[]
  level:  SkillLevel
}

// ─── Project data ─────────────────────────────────────────────────────────────

/**
 * A single verifiable metric.
 * value must be a measurable quantity — never a percentage hedge like "90%+",
 * never a forbidden "100% anything", never a qualitative noun used in a number field.
 */
export interface SystemMetric {
  value:       string
  label:       string
  badge:       BadgeType
  sourceLabel: string
  sourceHref?: string
  sublabel?:   string
}

/**
 * A single stage in an architecture pipeline.
 * label     — short name (≤ 3 words)
 * description — what this stage does (1–2 sentences max)
 * tech      — the specific library/service doing the work
 */
export interface ArcStage {
  id:          string
  label:       string
  description: string
  tech?:       string
}

/**
 * A documented architecture decision with an explicit rejected alternative.
 * Every field is required — incomplete decisions are not displayed.
 */
export interface DecisionRecord {
  decision: string   // what was decided (noun phrase)
  rejected: string   // the alternative that was NOT chosen
  chosen:   string   // the alternative that WAS chosen
  reason:   string   // why — must reference a measurable or structural constraint
}

/**
 * A Tier 1 blog article wired into a system card.
 * tier is constrained to 1 — only staff-level articles may appear in system cards.
 */
export interface BlogArticleRef {
  slug:              string
  title:             string
  tier:              1
  system_tag:        SystemId
  key_metric:        string
  metric_badge:      BadgeType
  read_time_minutes: number
  published_at:      string   // ISO 8601 date string
  excerpt:           string
}

/**
 * A blog post as shown on the blog index.
 * tier 1 = staff+ signal  | displayed in featured section + system cards
 * tier 2 = supporting     | displayed in /blog index only
 * tier 3 = low signal     | visible in /blog but suppressed from portfolio surfaces
 *
 * system_tag is null for general articles not tied to a specific system.
 * It is only required (and typed as SystemId) for Tier 1 articles via BlogArticleRef.
 */
export interface BlogPost {
  slug:              string
  title:             string
  tier:              1 | 2 | 3
  system_tag:        SystemId | null
  key_metric:        string
  metric_badge:      BadgeType
  read_time_minutes: number
  published_at:      string
  excerpt:           string
  tags:              string[]
}

/**
 * Full project data for a core system.
 * contextNote is for internal/non-public systems (e.g. UBEC) where
 * there is no public repo or live demo to link.
 */
export interface ProjectData {
  id:           SystemId
  name:         string
  tagline:      string
  description:  string
  stack:        string[]
  metrics:      SystemMetric[]
  arc:          ArcStage[]
  decisions:    DecisionRecord[]
  compliance:   ComplianceTag[]
  blog?:        BlogArticleRef
  demoUrl?:     string
  repoUrl?:     string
  contextNote?: string   // shown when demoUrl and repoUrl are absent
  featured:     boolean
}

// ─── GitHub stats ─────────────────────────────────────────────────────────────

export interface GitHubRepoData {
  stars:      number
  forks:      number
  language:   string | null
  lastPushed: string   // ISO 8601
  openIssues: number
}

// ─── Hero metric tile ─────────────────────────────────────────────────────────

export interface HeroMetricDef {
  value:       string
  label:       string
  badge:       BadgeType
  sourceLabel: string
  sourceHref?: string
  sublabel:    string
}