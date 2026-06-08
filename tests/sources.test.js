import { getSourcesForDay } from '../src/sources.js';

describe('getSourcesForDay', () => {
  test('returns sources for each day 0-6', () => {
    for (let day = 0; day <= 6; day++) {
      const sources = getSourcesForDay(day);
      expect(Array.isArray(sources)).toBe(true);
      expect(sources.length).toBeGreaterThan(0);
      sources.forEach(s => {
        expect(s).toHaveProperty('name');
        expect(s).toHaveProperty('url');
        expect(s).toHaveProperty('type'); // 'rss' | 'apify'
      });
    }
  });

  test('Monday (1) returns Founder Lens sources', () => {
    const sources = getSourcesForDay(1);
    expect(sources.some(s => s.theme === 'Founder Lens')).toBe(true);
  });

  test('Friday (5) returns Tech & AI sources', () => {
    const sources = getSourcesForDay(5);
    expect(sources.some(s => s.theme === 'Tech & AI')).toBe(true);
  });
});
