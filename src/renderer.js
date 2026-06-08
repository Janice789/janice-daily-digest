function escapeHtml(str) {
  return (str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStory(dive) {
  return `
<article class="story">
  <header class="story-header">
    <h2>${escapeHtml(dive.title)}</h2>
    <div class="meta"><span class="source">${escapeHtml(dive.source)}</span> · <span class="read-time">${escapeHtml(dive.readTime)}</span></div>
  </header>

  ${dive.quickTake ? `<blockquote class="quick-take">${escapeHtml(dive.quickTake)}</blockquote>` : ''}

  <section class="section">
    <h3>What Happened</h3>
    <p>${escapeHtml(dive.whatHappened)}</p>
  </section>

  <section class="section">
    <h3>Business Model Breakdown</h3>
    <p>${escapeHtml(dive.businessModel)}</p>
  </section>

  <section class="section">
    <h3>What Makes Them Succeed</h3>
    <p>${escapeHtml(dive.whatMakesThemSucceed)}</p>
  </section>

  <section class="section">
    <h3>First Principles</h3>
    <p>${escapeHtml(dive.firstPrinciples)}</p>
  </section>

  <section class="section highlight">
    <h3>Why It Matters to You</h3>
    <p>${escapeHtml(dive.whyItMattersToJanice)}</p>
  </section>

  <section class="section steal">
    <h3>What to Steal</h3>
    <p>${escapeHtml(dive.whatToSteal)}</p>
  </section>

  <a class="source-link" href="${escapeHtml(dive.url)}" target="_blank" rel="noopener">Read original →</a>
</article>`;
}

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; background: #fafaf8; color: #1a1a1a; line-height: 1.7; }
  .container { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
  header.page-header { border-bottom: 3px solid #1a1a1a; padding-bottom: 24px; margin-bottom: 48px; }
  .digest-label { font-family: monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #666; }
  h1 { font-size: 2rem; margin: 8px 0 4px; }
  .date-line { color: #888; font-size: 0.9rem; }
  article.story { margin-bottom: 64px; padding-bottom: 64px; border-bottom: 1px solid #e0e0d8; }
  article.story:last-child { border-bottom: none; }
  .story-header h2 { font-size: 1.4rem; line-height: 1.3; margin-bottom: 6px; }
  .meta { font-size: 0.85rem; color: #888; margin-bottom: 24px; }
  .source { font-weight: bold; color: #555; }
  blockquote.quick-take { font-size: 1.05rem; font-style: italic; line-height: 1.75; color: #1a1a1a; border-left: 4px solid #1a1a1a; margin: 0 0 32px; padding: 12px 20px; background: #f5f5f0; border-radius: 0 6px 6px 0; }
  .section { margin-bottom: 20px; }
  .section h3 { font-family: monospace; font-size: 0.75rem; letter-spacing: 1.5px; text-transform: uppercase; color: #999; margin-bottom: 6px; }
  .section p { font-size: 1rem; }
  .section.highlight { background: #fffbf0; border-left: 3px solid #f5a623; padding: 16px; border-radius: 0 4px 4px 0; }
  .section.steal { background: #f0f7ff; border-left: 3px solid #2979ff; padding: 16px; border-radius: 0 4px 4px 0; }
  .source-link { display: inline-block; margin-top: 16px; font-size: 0.85rem; color: #2979ff; text-decoration: none; font-family: monospace; }
  .source-link:hover { text-decoration: underline; }
  footer { margin-top: 48px; font-size: 0.8rem; color: #aaa; text-align: center; }
`;

export function renderDigestPage({ date, theme, dayLabel, dives }) {
  const stories = dives.map(renderStory).join('\n');
  const formatted = new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Janice's Daily Digest — ${escapeHtml(date)}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="container">
    <header class="page-header">
      <div class="digest-label">${escapeHtml(dayLabel)} · ${escapeHtml(theme)}</div>
      <h1>Janice's Daily Digest</h1>
      <div class="date-line">${escapeHtml(formatted)} · ${dives.length} deep dive${dives.length !== 1 ? 's' : ''}</div>
    </header>
    ${stories || '<p style="color:#999">No stories today.</p>'}
    <footer>Janice Daily Digest · Auto-generated · <a href="index.html">All digests →</a></footer>
  </div>
</body>
</html>`;
}

export function renderIndexPage(entries) {
  const rows = entries.map(e => `
    <li>
      <a href="${escapeHtml(e.date)}.html">
        <span class="entry-date">${escapeHtml(e.date)}</span>
        <span class="entry-theme">${escapeHtml(e.dayLabel)} · ${escapeHtml(e.theme)}</span>
        <span class="entry-count">${e.storyCount} stories</span>
      </a>
    </li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Janice's Daily Digest — Archive</title>
  <style>
    body { font-family: 'Georgia', serif; background: #fafaf8; color: #1a1a1a; max-width: 640px; margin: 60px auto; padding: 0 24px; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    p.sub { color: #888; margin-bottom: 32px; font-size: 0.9rem; }
    ul { list-style: none; }
    ul li { margin-bottom: 12px; }
    ul li a { display: flex; gap: 16px; align-items: baseline; text-decoration: none; color: inherit; padding: 12px; border-radius: 6px; transition: background 0.15s; }
    ul li a:hover { background: #f0f0ec; }
    .entry-date { font-family: monospace; font-size: 0.85rem; color: #666; min-width: 100px; }
    .entry-theme { flex: 1; font-size: 0.95rem; }
    .entry-count { font-size: 0.8rem; color: #aaa; white-space: nowrap; }
  </style>
</head>
<body>
  <h1>Janice's Daily Digest</h1>
  <p class="sub">Daily founder intelligence. All past issues:</p>
  <ul>${rows}</ul>
</body>
</html>`;
}
