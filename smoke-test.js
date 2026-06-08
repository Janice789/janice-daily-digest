import 'dotenv/config';
import { getSourcesForDay, getThemeForDay, getLabelForDay } from './src/sources.js';
import { fetchArticles } from './src/scraper.js';
import { generateDeepDives } from './src/analyzer.js';
import { renderDigestPage, renderIndexPage } from './src/renderer.js';
import { buildPublicDir, publishToGithubPages } from './src/publisher.js';
import { sendDigestEmail } from './src/email.js';

async function smokeTest() {
  console.log('=== SMOKE TEST ===');

  // Force Friday (Tech & AI) for a reliable source
  const dayIndex = 5;
  const date = new Date().toISOString().split('T')[0];
  const theme = getThemeForDay(dayIndex);
  const dayLabel = getLabelForDay(dayIndex);

  console.log(`Day: ${dayLabel} · ${theme}`);

  const sources = getSourcesForDay(dayIndex);
  console.log('Fetching articles...');
  const articles = await fetchArticles(sources, { maxPerSource: 4 });
  console.log(`Got ${articles.length} articles`);
  if (articles.length === 0) throw new Error('No articles fetched — check RSS sources');

  console.log('Generating deep-dives...');
  const dives = await generateDeepDives(articles, { theme, dayLabel });
  console.log(`Generated ${dives.length} deep-dives`);
  if (dives.length === 0) throw new Error('No deep-dives generated — check Anthropic API key');

  const digestHtml = renderDigestPage({ date, theme, dayLabel, dives });
  const indexHtml = renderIndexPage([{ date, theme, dayLabel, storyCount: dives.length }]);
  buildPublicDir({ date, digestHtml, indexHtml });
  console.log('HTML files written to ./public/');

  console.log('Publishing to GitHub Pages...');
  const baseUrl = await publishToGithubPages();
  const digestUrl = `${baseUrl}${date}.html`;
  console.log(`Published: ${digestUrl}`);

  console.log('Sending email...');
  await sendDigestEmail({ date, theme, dayLabel, digestUrl, dives });
  console.log('Email sent to', process.env.DIGEST_EMAIL_TO);

  console.log('\n=== SMOKE TEST PASSED ===');
  console.log(`Digest URL: ${digestUrl}`);
}

smokeTest().catch(err => {
  console.error('SMOKE TEST FAILED:', err);
  process.exit(1);
});
