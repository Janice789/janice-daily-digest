import { Resend } from 'resend';

export function buildSubject({ dayLabel, theme, date }) {
  const d = date ? new Date(date) : new Date();
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `[${dayLabel ?? '?'}] ${theme ?? 'Daily Digest'} — ${dateStr}`;
}

export function buildEmailHtml({ date, theme, dayLabel, digestUrl, dives }) {
  const teasers = (dives ?? []).map(d =>
    `<li style="margin-bottom:8px;">📖 <strong>${d.title ?? ''}</strong> <span style="color:#888;font-size:13px;">— ${d.source ?? ''}</span></li>`
  ).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Georgia,serif;background:#fafaf8;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;padding:32px 24px;background:#fff;border:1px solid #e8e8e0;border-radius:8px;">
    <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:8px;">${dayLabel ?? ''} · ${theme ?? ''}</div>
    <h1 style="font-size:1.4rem;margin:0 0 4px;">Janice's Daily Digest</h1>
    <p style="color:#888;font-size:0.85rem;margin:0 0 28px;">${date ?? ''}</p>

    <p style="margin-bottom:16px;font-size:0.95rem;">Today's deep dives:</p>
    <ul style="list-style:none;padding:0;margin:0 0 28px;">${teasers || '<li style="color:#aaa">No stories today.</li>'}</ul>

    <div style="margin-bottom:16px;">
      <a href="${digestUrl ?? '#'}"
         style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 28px;border-radius:4px;text-decoration:none;font-family:monospace;font-size:14px;letter-spacing:1px;font-weight:bold;">
        📖 READ TODAY'S DIGEST →
      </a>
    </div>

    <p style="font-size:0.8rem;color:#888;margin:0 0 4px;">Or copy this link:</p>
    <p style="font-size:0.8rem;margin:0 0 32px;">
      <a href="${digestUrl ?? '#'}" style="color:#2979ff;word-break:break-all;">${digestUrl ?? ''}</a>
    </p>

    <p style="font-size:0.75rem;color:#ccc;">Janice Daily Digest · Delivered 6am GMT+8</p>
  </div>
</body>
</html>`;
}

export async function sendDigestEmail({ date, theme, dayLabel, digestUrl, dives }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.DIGEST_EMAIL_FROM ?? 'onboarding@resend.dev',
    to: process.env.DIGEST_EMAIL_TO ?? 'janice@easybuzz.ai',
    subject: buildSubject({ dayLabel, theme, date }),
    html: buildEmailHtml({ date, theme, dayLabel, digestUrl, dives }),
  });
}
