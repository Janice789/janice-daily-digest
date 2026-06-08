import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a world-class business analyst and founder coach writing for Janice,
a Malaysian founder building EasyBuzz — a video content SaaS for Malaysian SMEs, priced $29-$249/month,
early stage, SEA market focus.

Your job: read the provided articles, select the 3-5 most insightful and relevant pieces,
and write a deep analytical dive for each. Do NOT summarize — reason deeply.
Think like Warren Buffett reading an annual report + Paul Graham advising a founder.`;

const USER_PROMPT = (articles, theme, dayLabel) => `
Today is ${dayLabel} — theme: ${theme}.

Here are today's articles:
${articles.map((a, i) => `
[${i + 1}] ${a.title}
Source: ${a.source}
URL: ${a.url}
Content: ${a.summary}
`).join('\n---\n')}

Select the best 3-5 articles and return a JSON array. Each object must have exactly these fields:
{
  "title": "article title",
  "source": "source name",
  "url": "article URL",
  "readTime": "X min",
  "whatHappened": "3-4 sentences of factual context",
  "businessModel": "How do they make money? Unit economics? Revenue model? (or economic logic if not a company story)",
  "whatMakesThemSucceed": "The unfair advantage, moat, or key insight they have",
  "firstPrinciples": "The fundamental truth this is built on. Why does it work at a deep level?",
  "whyItMattersToJanice": "Direct relevance to Janice: EasyBuzz, early-stage founder, Malaysian SMEs, SEA market, $29-$249 pricing",
  "whatToSteal": "2-3 concrete tactics or mental models Janice can apply tomorrow. Be specific, not generic."
}

Return ONLY valid JSON array. No markdown, no commentary.`;

export async function generateDeepDives(articles, { theme, dayLabel }) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: USER_PROMPT(articles, theme, dayLabel) },
    ],
  });

  const raw = message.content[0]?.text ?? '[]';
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    console.error('[analyzer] Failed to parse Claude response:', cleaned.slice(0, 200));
    return [];
  }
}
