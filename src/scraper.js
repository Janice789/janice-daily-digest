import Parser from 'rss-parser';

const parser = new Parser({ timeout: 10000 });

async function fetchRssSource(source, maxPerSource) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, maxPerSource).map(item => ({
      title: item.title ?? '',
      url: item.link ?? '',
      source: source.name,
      summary: item.contentSnippet ?? item.content ?? item.summary ?? '',
      publishedAt: item.pubDate ?? item.isoDate ?? '',
    }));
  } catch (err) {
    console.warn(`[scraper] Failed to fetch ${source.name}: ${err.message}`);
    return [];
  }
}

export async function fetchArticles(sources, { maxPerSource = 5 } = {}) {
  const results = await Promise.all(
    sources.map(source => fetchRssSource(source, maxPerSource))
  );
  return results.flat();
}
