import 'dotenv/config';
import { getSourcesForDay, getThemeForDay, getLabelForDay } from './sources.js';
import { fetchArticles } from './scraper.js';
import { generateDeepDives } from './analyzer.js';
import { renderDigestPage, renderIndexPage } from './renderer.js';
import { buildPublicDir, publishToGithubPages } from './publisher.js';
import { sendDigestEmail } from './email.js';

async function run() {
  // Validate required env vars
  const required = ['ANTHROPIC_API_KEY', 'RESEND_API_KEY', 'GITHUB_TOKEN', 'GITHUB_REPO_OWNER'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[run] Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  const today = new Date();
  const dayIndex = today.getDay();
  const date = today.toISOString().split('T')[0];
  const theme = getThemeForDay(dayIndex);
  const dayLabel = getLabelForDay(dayIndex);

  console.log(`[run] ${date} · ${dayLabel} · ${theme}`);

  // 1. Scrape
  const sources = getSourcesForDay(dayIndex);
  console.log(`[run] Fetching ${sources.length} sources...`);
  const articles = await fetchArticles(sources, { maxPerSource: 6 });
  console.log(`[run] Got ${articles.length} articles`);

  // 2. Analyze
  console.log('[run] Generating deep-dives with Claude...');
  const dives = await generateDeepDives(articles, { theme, dayLabel });
  console.log(`[run] Generated ${dives.length} deep-dives`);

  // 3. Render
  const digestHtml = renderDigestPage({ date, theme, dayLabel, dives });
  // Build index entries — read existing from public/ if present
  const indexEntries = [{ date, theme, dayLabel, storyCount: dives.length }];
  const indexHtml = renderIndexPage(indexEntries);

  // 4. Publish
  buildPublicDir({ date, digestHtml, indexHtml });
  console.log('[run] Publishing to GitHub Pages...');
  const baseUrl = await publishToGithubPages();
  const digestUrl = `${baseUrl}${date}.html`;
  console.log(`[run] Published: ${digestUrl}`);

  // 5. Email
  console.log('[run] Sending email...');
  await sendDigestEmail({ date, theme, dayLabel, digestUrl, dives });
  console.log('[run] Done.');
}

run().catch(err => {
  console.error('[run] Fatal error:', err);
  process.exit(1);
});
