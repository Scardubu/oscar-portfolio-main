import { track } from '@vercel/analytics';

type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsProperties = Record<string, AnalyticsPrimitive | undefined>;

function sanitizeProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== '')
  );
}

export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === 'undefined') return;

  track(
    action,
    sanitizeProperties({
      category,
      label,
      value,
      ...properties,
    })
  );
}

export function trackSectionView(sectionId: string, chapterId: string, chapterLabel: string) {
  trackEvent('Portfolio', 'SectionView', sectionId, undefined, {
    chapter_id: chapterId,
    chapter_label: chapterLabel,
    non_interaction: true,
  });
}
