import { buildEmailHtml, buildSubject } from '../src/email.js';

describe('buildSubject', () => {
  test('includes day label, theme, and date', () => {
    const subject = buildSubject({ dayLabel: 'Mon', theme: 'Founder Lens', date: '2026-06-08' });
    expect(subject).toContain('Mon');
    expect(subject).toContain('Founder Lens');
    expect(subject).toContain('Jun 8');
  });

  test('does not crash if fields are null', () => {
    expect(() => buildSubject({ dayLabel: null, theme: null, date: null })).not.toThrow();
  });
});

describe('buildEmailHtml', () => {
  test('includes link to digest page', () => {
    const html = buildEmailHtml({
      date: '2026-06-08',
      theme: 'Founder Lens',
      dayLabel: 'Mon',
      digestUrl: 'https://user.github.io/janice-daily-digest/2026-06-08.html',
      dives: [
        { title: 'Stripe raises $1B', source: 'TechCrunch' },
      ],
    });
    expect(html).toContain('2026-06-08.html');
    expect(html).toContain('Stripe raises $1B');
  });

  test('handles empty dives without crashing', () => {
    expect(() => buildEmailHtml({
      date: '2026-06-08', theme: 'Founder Lens', dayLabel: 'Mon',
      digestUrl: 'https://x.com', dives: [],
    })).not.toThrow();
  });
});
