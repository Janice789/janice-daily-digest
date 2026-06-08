import { generateDeepDives } from '../src/analyzer.js';

const MOCK_ARTICLES = [
  {
    title: 'Stripe raises $1B at $65B valuation',
    url: 'https://techcrunch.com/stripe-raises',
    source: 'TechCrunch',
    summary: 'Stripe has raised a new funding round valuing the payments company at $65 billion.',
    publishedAt: '2026-06-08',
  },
  {
    title: 'How Notion built a $10B business',
    url: 'https://review.firstround.com/notion',
    source: 'First Round Review',
    summary: 'Notion co-founder Ivan Zhao explains how the company grew from zero to 30M users.',
    publishedAt: '2026-06-07',
  },
];

describe('generateDeepDives', () => {
  test('returns array of deep-dive objects', async () => {
    const dives = await generateDeepDives(MOCK_ARTICLES, {
      theme: 'Founder Lens',
      dayLabel: 'Mon',
    });
    expect(Array.isArray(dives)).toBe(true);
    expect(dives.length).toBeGreaterThanOrEqual(1);
    dives.forEach(d => {
      expect(d).toHaveProperty('title');
      expect(d).toHaveProperty('source');
      expect(d).toHaveProperty('url');
      expect(d).toHaveProperty('whatHappened');
      expect(d).toHaveProperty('businessModel');
      expect(d).toHaveProperty('whatMakesThemSucceed');
      expect(d).toHaveProperty('firstPrinciples');
      expect(d).toHaveProperty('whyItMattersToJanice');
      expect(d).toHaveProperty('whatToSteal');
      expect(typeof d.whatToSteal).toBe('string');
    });
  }, 60000);

  test('returns at most 5 deep-dives', async () => {
    const dives = await generateDeepDives(MOCK_ARTICLES, {
      theme: 'Founder Lens',
      dayLabel: 'Mon',
    });
    expect(dives.length).toBeLessThanOrEqual(5);
  }, 60000);
});
