import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Shared contact endpoint: receives JSON from the site forms and delivers
// each submission as an email through the domain's own SMTP server.
// Required env vars (set in Vercel dashboard and .env locally):
//   SMTP_HOST, SMTP_USER, SMTP_PASS

export const prerender = false;

const ALLOWED_ORIGINS = new Set([
  'https://basukaenergy.com',
  'https://www.basukaenergy.com',
  'http://localhost:4321',
]);

const MAILBOXES = new Set([
  'info@basukaenergy.com',
  'partners@basukaenergy.com',
  'basukaacademy@basukaenergy.com',
]);

// Simple in-memory rate limit per IP (per serverless instance).
const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

function json(data: unknown, status = 200, origin = '') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  // CORS: the apex domain 308-redirects to www, which makes form fetches
  // cross-origin — allow both so submissions never break on either host.
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Vary'] = 'Origin';
  }
  // 204 responses must not carry a body (production runtime rejects it).
  return new Response(status === 204 ? null : JSON.stringify(data), {
    status,
    headers,
  });
}

export const OPTIONS: APIRoute = ({ request }) =>
  json({}, 204, request.headers.get('origin') ?? '');

const clean = (v: unknown, max = 2000) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export const POST: APIRoute = async ({ request }) => {
  // Origin check: only the site itself may submit.
  const origin = request.headers.get('origin') ?? '';
  if (!ALLOWED_ORIGINS.has(origin)) {
    return json({ ok: false, error: 'Origin not allowed' }, 403);
  }

  // Rate limit: 5 submissions per 10 minutes per IP per instance.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  const now = Date.now();
  const entry = hits.get(ip);
  if (entry && now < entry.reset) {
    entry.count += 1;
    if (entry.count > RATE_LIMIT) {
      return json({ ok: false, error: 'Too many submissions. Try later.' }, 429, origin);
    }
  } else {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400, origin);
  }

  const to = clean(body.to, 100).toLowerCase();
  if (!MAILBOXES.has(to)) {
    return json({ ok: false, error: 'Unknown destination' }, 400, origin);
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 300);
  const message = clean(body.message, 8000);
  const context = clean(body.context, 120);

  if (!message) {
    return json({ ok: false, error: 'Message is required' }, 400, origin);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Invalid email address' }, 400, origin);
  }
  // Honeypot: bots fill every field; humans never see this one.
  if (clean(body.website, 200)) {
    return json({ ok: true }); // pretend success, drop the spam
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = import.meta.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return json({ ok: false, error: 'Email service not configured' }, 500, origin);
  }

  const lines = [
    `Name: ${name || '(not provided)'}`,
    `Email: ${email || '(not provided)'}`,
    subject ? `Subject: ${subject}` : null,
    '',
    message,
    '',
    `— Sent from ${context || 'basukaenergy.com'}`,
  ].filter((l): l is string => l !== null);

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(import.meta.env.SMTP_PORT) || 465,
      secure: (Number(import.meta.env.SMTP_PORT) || 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"BaSuka Energy Website" <${SMTP_USER}>`,
      to,
      replyTo: email || undefined,
      subject:
        subject || context
          ? `[Website] ${context ? context + (subject ? ' — ' + subject : '') : subject}`.slice(0, 200)
          : '[Website] New inquiry',
      text: lines.join('\n'),
    });

    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error('Contact API SMTP error:', err);
    return json({ ok: false, error: 'Delivery failed' }, 502, origin);
  }
};
