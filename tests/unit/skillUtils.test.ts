import { describe, it, expect } from 'vitest';
import {
  generateSkillLinks,
  skillsToNodes,
  getNodeRadius,
  getProficiencyLabel,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '@/app/lib/skillUtils';
import type { Skill } from '@/app/lib/constants';

describe('skillUtils', () => {
  const mockSkills: Skill[] = [
    {
      id: 'python',
      name: 'Python',
      category: 'ml',
      proficiency: 'expert',
      yearsOfExperience: 5,
      projects: ['sabiscore'],
      relatedSkills: ['fastapi', 'xgboost'],
    },
    {
      id: 'fastapi',
      name: 'FastAPI',
      category: 'backend',
      proficiency: 'advanced',
      yearsOfExperience: 3,
      projects: ['sabiscore', 'hashablanca'],
      relatedSkills: ['python'],
    },
    {
      id: 'xgboost',
      name: 'XGBoost',
      category: 'ml',
      proficiency: 'expert',
      yearsOfExperience: 4,
      projects: ['sabiscore'],
      relatedSkills: ['python'],
    },
  ];

  describe('generateSkillLinks', () => {
    it('should generate bidirectional links from relatedSkills', () => {
      const links = generateSkillLinks(mockSkills);

      expect(links.length).toBeGreaterThan(0);
      expect(links.some((l) => l.source === 'python' && l.target === 'fastapi')).toBe(true);
      expect(links.some((l) => l.source === 'python' && l.target === 'xgboost')).toBe(true);
    });

    it('should not create duplicate links', () => {
      const links = generateSkillLinks(mockSkills);
      const linkSet = new Set(links.map((l) => `${l.source}-${l.target}`));

      expect(linkSet.size).toBe(links.length);
    });

    it('should only create links for skills that exist in the array', () => {
      const skillsWithInvalidRelation: Skill[] = [
        {
          id: 'skill1',
          name: 'Skill 1',
          category: 'ml',
          proficiency: 'expert',
          yearsOfExperience: 5,
          projects: [],
          relatedSkills: ['nonexistent'],
        },
      ];

      const links = generateSkillLinks(skillsWithInvalidRelation);
      expect(links.length).toBe(0);
    });
  });

  describe('skillsToNodes', () => {
    it('should convert skills array to graph nodes', () => {
      const nodes = skillsToNodes(mockSkills);

      expect(nodes.length).toBe(mockSkills.length);
      expect(nodes[0]).toHaveProperty('id');
      expect(nodes[0]).toHaveProperty('name');
      expect(nodes[0]).toHaveProperty('category');
      expect(nodes[0]).toHaveProperty('proficiency');
    });

    it('should preserve all skill properties', () => {
      const nodes = skillsToNodes(mockSkills);
      const pythonNode = nodes.find((n) => n.id === 'python');

      expect(pythonNode).toBeDefined();
      expect(pythonNode?.name).toBe('Python');
      expect(pythonNode?.category).toBe('ml');
      expect(pythonNode?.proficiency).toBe('expert');
      expect(pythonNode?.yearsOfExperience).toBe(5);
    });
  });

  describe('getNodeRadius', () => {
    it('should return correct radius for expert proficiency', () => {
      expect(getNodeRadius('expert')).toBe(24);
    });

    it('should return correct radius for advanced proficiency', () => {
      expect(getNodeRadius('advanced')).toBe(18);
    });

    it('should return correct radius for proficient proficiency', () => {
      expect(getNodeRadius('proficient')).toBe(14);
    });
  });

  describe('getProficiencyLabel', () => {
    it('should capitalize proficiency levels', () => {
      expect(getProficiencyLabel('expert')).toBe('Expert');
      expect(getProficiencyLabel('advanced')).toBe('Advanced');
      expect(getProficiencyLabel('proficient')).toBe('Proficient');
    });
  });

  describe('CATEGORY_COLORS', () => {
    it('should have colors for all categories', () => {
      expect(CATEGORY_COLORS.ml).toBeDefined();
      expect(CATEGORY_COLORS.backend).toBeDefined();
      expect(CATEGORY_COLORS.frontend).toBeDefined();
      expect(CATEGORY_COLORS.devops).toBeDefined();
      expect(CATEGORY_COLORS.blockchain).toBeDefined();
    });

    it('should use valid hex color format', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      Object.values(CATEGORY_COLORS).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe('CATEGORY_LABELS', () => {
    it('should have labels for all categories', () => {
      expect(CATEGORY_LABELS.ml).toBe('ML & AI');
      expect(CATEGORY_LABELS.backend).toBe('Backend');
      expect(CATEGORY_LABELS.frontend).toBe('Frontend');
      expect(CATEGORY_LABELS.devops).toBe('DevOps');
      expect(CATEGORY_LABELS.blockchain).toBe('Blockchain');
    });
  });
});
