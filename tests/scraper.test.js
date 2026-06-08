import { fetchArticles } from '../src/scraper.js';

describe('fetchArticles', () => {
  test('returns array of article objects', async () => {
    const sources = [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', type: 'rss' },
    ];
    const articles = await fetchArticles(sources, { maxPerSource: 3 });
    expect(Array.isArray(articles)).toBe(true);
    articles.forEach(a => {
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('url');
      expect(a).toHaveProperty('source');
      expect(a).toHaveProperty('summary');
      expect(typeof a.title).toBe('string');
    });
  }, 30000);

  test('respects maxPerSource limit', async () => {
    const sources = [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', type: 'rss' },
    ];
    const articles = await fetchArticles(sources, { maxPerSource: 2 });
    expect(articles.length).toBeLessThanOrEqual(2);
  }, 30000);

  test('returns empty array on bad URL, does not throw', async () => {
    const sources = [
      { name: 'Bad', url: 'https://this-url-does-not-exist-xyz.com/rss', type: 'rss' },
    ];
    const articles = await fetchArticles(sources, { maxPerSource: 3 });
    expect(Array.isArray(articles)).toBe(true);
  }, 15000);
});
