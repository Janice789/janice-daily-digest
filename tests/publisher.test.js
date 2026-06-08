import { buildPublicDir } from '../src/publisher.js';
import fs from 'fs';
import path from 'path';

describe('buildPublicDir', () => {
  test('writes HTML file to public/ directory', () => {
    buildPublicDir({
      date: '2026-06-08',
      digestHtml: '<!DOCTYPE html><html><body>Test</body></html>',
      indexHtml: '<!DOCTYPE html><html><body>Index</body></html>',
    });

    const digestPath = path.resolve('./public/2026-06-08.html');
    const indexPath = path.resolve('./public/index.html');

    expect(fs.existsSync(digestPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.readFileSync(digestPath, 'utf8')).toContain('Test');
    expect(fs.readFileSync(indexPath, 'utf8')).toContain('Index');
  });
});
