import fs from 'fs';
import path from 'path';
import ghpages from 'gh-pages';

const PUBLIC_DIR = path.resolve('./public');

export function buildPublicDir({ date, digestHtml, indexHtml }) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, `${date}.html`), digestHtml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml, 'utf8');
}

export async function publishToGithubPages() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME ?? 'janice-daily-digest';

  return new Promise((resolve, reject) => {
    ghpages.publish(PUBLIC_DIR, {
      branch: 'gh-pages',
      repo: `https://${token}@github.com/${owner}/${repo}.git`,
      user: { name: 'Digest Bot', email: 'bot@easybuzz.ai' },
      message: `digest: ${new Date().toISOString().split('T')[0]}`,
    }, (err) => {
      if (err) reject(err);
      else resolve(`https://${owner}.github.io/${repo}/`);
    });
  });
}
