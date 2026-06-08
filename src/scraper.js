import Parser from 'rss-parser';
import { ApifyClient } from 'apify-client';

const parser = new Parser({ timeout: 10000 });
const FULL_TEXT_LIMIT = 3; // enrich top N articles with full text

async function fetchRssSource(source, maxPerSource) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, maxPerSource).map(item => ({
      title: item.title ?? '',
      url: item.link ?? '',
      source: source.name,
      summary: item.contentSnippet ?? item.content ?? item.summary ?? '',
      publishedAt: item.pubDate ?? item.isoDate ?? '',
      fullText: null,
    }));
  } catch (err) {
    console.warn(`[scraper] Failed to fetch ${source.name}: ${err.message}`);
    return [];
  }
}

async function fetchFullText(url) {
  try {
    const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });
    const run = await client.actor('apify/rag-web-browser').call(
      { query: url, maxResults: 1, outputFormats: ['markdown'], scrapingTool: 'raw-http' },
      { memory: 256 },
    );
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items[0]?.markdown ?? items[0]?.text ?? null;
  } catch (err) {
    console.warn(`[scraper] Full-text fetch failed for ${url}: ${err.message}`);
    return null;
  }
}

// Fetch top 3 headlines per theme across all 7 themes — RSS only, no Apify
export async function fetchQuickScan(allThemes) {
  const results = await Promise.all(
    allThemes.map(async ({ theme, label, feeds }) => {
      const feedResults = await Promise.all(
        feeds.map(source => fetchRssSource(source, 3))
      );
      const articles = feedResults.flat().slice(0, 3).map(a => ({
        title: a.title,
        url: a.url,
        source: a.source,
        snippet: a.summary ? a.summary.replace(/<[^>]+>/g, '').slice(0, 120).trim() : '',
      }));
      return { theme, label, articles };
    })
  );
  return results;
}

export async function fetchArticles(sources, { maxPerSource = 5 } = {}) {
  // 1. Fetch RSS from all sources
  const results = await Promise.all(
    sources.map(source => fetchRssSource(source, maxPerSource))
  );
  const articles = results.flat();

  // 2. Enrich top N articles with full text via Apify (sequential to stay within memory limits)
  const toEnrich = articles.slice(0, FULL_TEXT_LIMIT);
  for (const article of toEnrich) {
    article.fullText = await fetchFullText(article.url);
  }

  const enriched = toEnrich.filter(Boolean).filter(a => a.fullText).length;
  console.log(`[scraper] Full text fetched for ${enriched}/${toEnrich.length} articles`);

  return articles;
}
