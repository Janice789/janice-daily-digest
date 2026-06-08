import { renderDigestPage, renderIndexPage } from '../src/renderer.js';

const MOCK_DIVES = [
  {
    title: 'Stripe raises $1B',
    source: 'TechCrunch',
    url: 'https://techcrunch.com/stripe',
    readTime: '8 min',
    whatHappened: 'Stripe raised $1B at a $65B valuation in a down market.',
    businessModel: 'Transaction fees (2.9% + 30c) plus enterprise SaaS subscriptions.',
    whatMakesThemSucceed: 'Developer-first distribution and API-quality obsession.',
    firstPrinciples: 'Make the hard thing (online payments) the easy default.',
    whyItMattersToJanice: 'EasyBuzz can own a niche by being the easiest video tool for Malaysian SMEs.',
    whatToSteal: '1. Ship the API before the UI. 2. Make your pricing obvious.',
  },
];

describe('renderDigestPage', () => {
  test('returns valid HTML string', () => {
    const html = renderDigestPage({
      date: '2026-06-08',
      theme: 'Founder Lens',
      dayLabel: 'Mon',
      dives: MOCK_DIVES,
    });
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Stripe raises $1B');
    expect(html).toContain('Founder Lens');
    expect(html).toContain('2026-06-08');
  });

  test('handles empty dives without crashing', () => {
    const html = renderDigestPage({
      date: '2026-06-08',
      theme: 'Founder Lens',
      dayLabel: 'Mon',
      dives: [],
    });
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
  });
});

describe('renderIndexPage', () => {
  test('returns HTML with digest links', () => {
    const entries = [
      { date: '2026-06-08', theme: 'Founder Lens', dayLabel: 'Mon', storyCount: 3 },
      { date: '2026-06-07', theme: 'Mental Models', dayLabel: 'Sun', storyCount: 4 },
    ];
    const html = renderIndexPage(entries);
    expect(html).toContain('2026-06-08.html');
    expect(html).toContain('Founder Lens');
    expect(html).toContain('Mental Models');
  });
});
