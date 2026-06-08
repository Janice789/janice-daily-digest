// Day-of-week source config. getDay() returns 0=Sun,1=Mon,...,6=Sat
const SOURCES = {
  0: { // Sunday — Mental Models
    theme: 'Mental Models',
    label: 'Sun',
    feeds: [
      { name: 'Farnam Street', url: 'https://fs.blog/feed/', type: 'rss', theme: 'Mental Models' },
      { name: 'Stratechery', url: 'https://stratechery.com/feed/', type: 'rss', theme: 'Mental Models' },
      { name: 'Aeon Essays', url: 'https://aeon.co/feed.rss', type: 'rss', theme: 'Mental Models' },
      { name: 'Nautilus', url: 'https://nautil.us/feed/', type: 'rss', theme: 'Mental Models' },
    ],
  },
  1: { // Monday — Founder Lens
    theme: 'Founder Lens',
    label: 'Mon',
    feeds: [
      { name: 'First Round Review', url: 'https://review.firstround.com/feed.xml', type: 'rss', theme: 'Founder Lens' },
      { name: 'a16z', url: 'https://a16z.com/feed/', type: 'rss', theme: 'Founder Lens' },
      { name: 'Acquired FM', url: 'https://www.acquired.fm/episodes?format=rss', type: 'rss', theme: 'Founder Lens' },
      { name: 'Lenny Newsletter', url: 'https://www.lennysnewsletter.com/feed', type: 'rss', theme: 'Founder Lens' },
    ],
  },
  2: { // Tuesday — Primary Sources
    theme: 'Primary Sources',
    label: 'Tue',
    feeds: [
      { name: 'Financial Times', url: 'https://www.ft.com/?format=rss', type: 'rss', theme: 'Primary Sources' },
      { name: 'Wall Street Journal', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', type: 'rss', theme: 'Primary Sources' },
      { name: 'Bloomberg Technology', url: 'https://feeds.bloomberg.com/technology/news.rss', type: 'rss', theme: 'Primary Sources' },
      { name: 'Harvard Business Review', url: 'https://feeds.hbr.org/harvardbusiness/', type: 'rss', theme: 'Primary Sources' },
    ],
  },
  3: { // Wednesday — Builder Biographies
    theme: 'Builder Biographies',
    label: 'Wed',
    feeds: [
      { name: 'Invest Like the Best', url: 'https://investlikethebest.libsyn.com/rss', type: 'rss', theme: 'Builder Biographies' },
      { name: 'Lenny Newsletter', url: 'https://www.lennysnewsletter.com/feed', type: 'rss', theme: 'Builder Biographies' },
      { name: 'a16z', url: 'https://a16z.com/feed/', type: 'rss', theme: 'Builder Biographies' },
      { name: 'First Round Review', url: 'https://review.firstround.com/feed.xml', type: 'rss', theme: 'Builder Biographies' },
    ],
  },
  4: { // Thursday — Culture & Design
    theme: 'Culture & Design',
    label: 'Thu',
    feeds: [
      { name: 'Wired Business', url: 'https://www.wired.com/feed/category/business/latest/rss', type: 'rss', theme: 'Culture & Design' },
      { name: 'Design Observer', url: 'https://designobserver.com/rss/', type: 'rss', theme: 'Culture & Design' },
      { name: 'Aeon', url: 'https://aeon.co/feed.rss', type: 'rss', theme: 'Culture & Design' },
      { name: 'Stratechery', url: 'https://stratechery.com/feed/', type: 'rss', theme: 'Culture & Design' },
    ],
  },
  5: { // Friday — Tech & AI
    theme: 'Tech & AI',
    label: 'Fri',
    feeds: [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', type: 'rss', theme: 'Tech & AI' },
      { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss', theme: 'Tech & AI' },
      { name: 'TLDR AI', url: 'https://tldr.tech/api/rss/ai', type: 'rss', theme: 'Tech & AI' },
      { name: 'MIT Tech Review AI', url: 'https://www.technologyreview.com/feed/', type: 'rss', theme: 'Tech & AI' },
    ],
  },
  6: { // Saturday — Competitive Intel
    theme: 'Competitive Intel',
    label: 'Sat',
    feeds: [
      { name: 'Stratechery', url: 'https://stratechery.com/feed/', type: 'rss', theme: 'Competitive Intel' },
      { name: 'Bloomberg Technology', url: 'https://feeds.bloomberg.com/technology/news.rss', type: 'rss', theme: 'Competitive Intel' },
      { name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', type: 'rss', theme: 'Competitive Intel' },
      { name: 'Motley Fool', url: 'https://www.fool.com/feeds/index.aspx', type: 'rss', theme: 'Competitive Intel' },
    ],
  },
};

export function getSourcesForDay(dayIndex) {
  const config = SOURCES[dayIndex];
  if (!config) throw new Error(`No sources configured for day index ${dayIndex}`);
  return config.feeds;
}

export function getThemeForDay(dayIndex) {
  return SOURCES[dayIndex]?.theme ?? 'Daily Digest';
}

export function getLabelForDay(dayIndex) {
  return SOURCES[dayIndex]?.label ?? '?';
}
