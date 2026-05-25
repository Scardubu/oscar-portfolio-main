'use client';

import { m, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { ALL_PILLARS, SKILLS } from '@/lib/data/skills';
import { SPRING_SMOOTH } from '@/lib/motion';
import type { SkillLevel, SkillPillar } from '@/lib/types';

const LEVEL_WEIGHT: Record<SkillLevel, number> = {
  foundational: 1,
  proficient: 2,
  expert: 3,
};

const RINGS = [0.25, 0.5, 0.75, 1] as const;

const PILLAR_SHORT_LABEL: Record<SkillPillar, string> = {
  'Frontend & Full-Stack': 'Frontend',
  'ML & AI': 'ML',
  'Backend & APIs': 'Backend',
  'Data & Storage': 'Data',
  'DevOps & SRE': 'DevOps',
  'Fintech & Compliance': 'Fintech',
  'AI Agent Orchestration': 'Agents',
  'Blockchain & Web3': 'Web3',
};

type PillarMetric = {
  pillar: SkillPillar;
  score: number;
  total: number;
  expert: number;
  proficient: number;
  foundational: number;
};

function toPolarPoint(angle: number, radius: number, center = 50) {
  const x = center + radius * Math.cos(angle);
  const y = center + radius * Math.sin(angle);
  return { x, y };
}

function formatPoint(x: number, y: number) {
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

export function SkillsRadar() {
  const reducedMotion = useReducedMotion();

  const metrics = useMemo<PillarMetric[]>(() => {
    return ALL_PILLARS.map((pillar) => {
      const pillarSkills = SKILLS.filter((skill) => skill.pillar === pillar);
      const total = pillarSkills.length;
      const expert = pillarSkills.filter((skill) => skill.level === 'expert').length;
      const proficient = pillarSkills.filter((skill) => skill.level === 'proficient').length;
      const foundational = pillarSkills.filter((skill) => skill.level === 'foundational').length;

      const weighted = pillarSkills.reduce((sum, skill) => sum + LEVEL_WEIGHT[skill.level], 0);
      const score = total > 0 ? weighted / (total * 3) : 0;

      return {
        pillar,
        score,
        total,
        expert,
        proficient,
        foundational,
      };
    });
  }, []);

  const chartData = useMemo(() => {
    const count = metrics.length;

    const axis = metrics.map((_, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      return {
        angle,
        edge: toPolarPoint(angle, 40),
        label: toPolarPoint(angle, 45),
      };
    });

    const polygonPoints = metrics
      .map((metric, index) => {
        const angle = axis[index]?.angle ?? 0;
        const radius = 40 * metric.score;
        const point = toPolarPoint(angle, radius);
        return formatPoint(point.x, point.y);
      })
      .join(' ');

    const dataPoints = metrics.map((metric, index) => {
      const angle = axis[index]?.angle ?? 0;
      return toPolarPoint(angle, 40 * metric.score);
    });

    return {
      axis,
      polygonPoints,
      dataPoints,
    };
  }, [metrics]);

  return (
    <div className="space-y-5" data-cinematic="panel">
      <div className="border-color-border rounded-[var(--radius-lg)] border bg-[oklch(100%_0_0_/_0.02)] p-4 sm:p-5">
        <svg
          viewBox="0 0 100 100"
          className="mx-auto aspect-square w-full max-w-3xl"
          role="img"
          aria-label="Skills radar chart across all pillars"
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            {RINGS.map((ring) => (
              <circle
                key={ring}
                cx="50"
                cy="50"
                r={40 * ring}
                fill="none"
                className="stroke-white/10"
                strokeWidth="0.4"
              />
            ))}
          </g>

          <g>
            {chartData.axis.map((axis, index) => (
              <line
                key={`axis-${index}`}
                x1="50"
                y1="50"
                x2={axis.edge.x}
                y2={axis.edge.y}
                className="stroke-white/20"
                strokeWidth="0.35"
              />
            ))}
          </g>

          <m.polygon
            points={chartData.polygonPoints}
            fill="oklch(73% 0.18 196 / 0.22)"
            stroke="oklch(73% 0.18 196 / 0.9)"
            strokeWidth="0.9"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reducedMotion ? { duration: 0 } : SPRING_SMOOTH}
          />

          <g>
            {chartData.dataPoints.map((point, index) => (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="1.1"
                fill="oklch(73% 0.18 196 / 0.95)"
                className="stroke-black/40"
                strokeWidth="0.25"
              />
            ))}
          </g>

          <g>
            {chartData.axis.map((axis, index) => {
              const pillar = metrics[index]?.pillar;
              if (!pillar) return null;

              const anchor = axis.label.x >= 51 ? 'start' : axis.label.x <= 49 ? 'end' : 'middle';

              return (
                <text
                  key={`label-${pillar}`}
                  x={axis.label.x}
                  y={axis.label.y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  className="fill-white/75 font-mono text-[2.9px] tracking-[0.3px] uppercase"
                >
                  {PILLAR_SHORT_LABEL[pillar]}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2" aria-label="Radar pillar breakdown">
        {metrics.map((metric) => (
          <li
            key={metric.pillar}
            className="border-color-border-subtle rounded-[var(--radius-md)] border bg-[oklch(100%_0_0_/_0.012)] p-3"
          >
            <p className="text-color-text-primary text-xs font-semibold sm:text-sm">
              {metric.pillar}
            </p>
            <p className="text-color-text-muted mt-1 font-mono text-[10px] tracking-wide">
              {metric.total} skills · {metric.expert} expert · {metric.proficient} proficient ·{' '}
              {metric.foundational} foundational
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
