import { describe, expect, it } from 'vitest';

import { clamp, cn, formatDate, formatMonthYear, truncate } from '@/lib/utils';

// formatMonthYear drives the hero availability pill ("Updated <Month YYYY>").
// A mid-month date is timezone-safe: a day shift across the UTC boundary can
// never move May 19 out of May, so the assertion is deterministic everywhere.
describe('formatMonthYear', () => {
  it('renders an ISO date as "Month YYYY"', () => {
    expect(formatMonthYear('2026-05-19')).toBe('May 2026');
  });

  it('falls back gracefully on an invalid date', () => {
    expect(formatMonthYear('not-a-date')).toBe('Recently verified');
  });
});

// clamp backs useReadingProgress (scroll fraction must stay in [0, 1]).
describe('clamp', () => {
  it('clamps below, within, and above the range', () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(2, 0, 1)).toBe(1);
  });
});

describe('truncate', () => {
  it('leaves strings within the limit untouched', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates longer strings with an ellipsis at n-1', () => {
    expect(truncate('hello world', 5)).toBe('hell…');
  });
});

describe('formatDate', () => {
  it('returns the raw input when the date is unparseable', () => {
    expect(formatDate('definitely-not-a-date')).toBe('definitely-not-a-date');
  });
});

describe('cn', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    expect(cn('px-2', false, 'px-4')).toBe('px-4');
  });
});
