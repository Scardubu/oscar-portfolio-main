import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/portfolio-metrics/route';

describe('/api/portfolio-metrics', () => {
  it('should return 200 status', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('should return valid JSON with uptime data', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('uptime');
    expect(data.uptime).toHaveProperty('percentage');
    expect(data.uptime).toHaveProperty('last90DaysIncidents');
    expect(typeof data.uptime.percentage).toBe('number');
    expect(typeof data.uptime.last90DaysIncidents).toBe('number');
  });

  it('should return valid performance metrics', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('performance');
    expect(data.performance).toHaveProperty('fcpMs');
    expect(data.performance).toHaveProperty('lcpMs');
    expect(data.performance).toHaveProperty('ttfbMs');
    expect(data.performance).toHaveProperty('bundleKb');

    expect(typeof data.performance.fcpMs).toBe('number');
    expect(typeof data.performance.lcpMs).toBe('number');
    expect(typeof data.performance.ttfbMs).toBe('number');
    expect(typeof data.performance.bundleKb).toBe('number');
  });

  it('should return valid traffic data', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('traffic');
    expect(data.traffic).toHaveProperty('monthlyVisitors');
    expect(data.traffic).toHaveProperty('avgSessionSeconds');
    expect(typeof data.traffic.monthlyVisitors).toBe('number');
    expect(typeof data.traffic.avgSessionSeconds).toBe('number');
  });

  it('should include cache control headers', async () => {
    const response = await GET();
    const cacheControl = response.headers.get('Cache-Control');

    expect(cacheControl).toBeDefined();
    expect(cacheControl).toContain('s-maxage=3600');
  });

  it('should return PRD-compliant metrics values', async () => {
    const response = await GET();
    const data = await response.json();

    // PRD targets: 99.9%+ uptime, <150ms FCP, <500ms LCP
    expect(data.uptime.percentage).toBeGreaterThanOrEqual(99.9);
    expect(data.performance.fcpMs).toBeLessThan(150);
    expect(data.performance.lcpMs).toBeLessThan(500);
    expect(data.performance.bundleKb).toBeLessThan(300);
  });
});
