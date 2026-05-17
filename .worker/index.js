/**
 * dao-checkin — anonymous reflection journal Worker
 *
 * Endpoints:
 *   POST /submit       — accept a reflection entry (anon)
 *   GET  /count        — public total submissions count (cached)
 *   GET  /themes       — Dr Non's dashboard (basic auth)
 *   GET  /entries.csv  — Dr Non's CSV export (basic auth)
 *
 * Privacy model:
 *   - Client sends an `anon_uuid` (random ID generated locally, kept in localStorage).
 *   - Worker stores a salted SHA-256 hash of that UUID, never the raw UUID.
 *   - No IP logged. No fingerprint. No cookies set.
 *   - Country + timezone optional; both are coarse.
 *
 * Auth:
 *   - /themes and /entries.csv require basic auth: env.DASHBOARD_USER / env.DASHBOARD_PASS
 *   - Configure via `wrangler secret put DASHBOARD_USER` and `wrangler secret put DASHBOARD_PASS`
 *
 * Salt:
 *   - env.HASH_SALT is required. Configure via `wrangler secret put HASH_SALT`.
 */

const MAX_ANSWER_LEN = 8000;   // ~1500 words
const MAX_QUESTION_LEN = 500;

function corsHeaders(env, req) {
  const origin = req.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || '*';
  // Allow exact match OR localhost dev OR wildcard config
  const ok = (allowed === '*') ||
             (origin === allowed) ||
             (/^https?:\/\/localhost(:\d+)?$/.test(origin)) ||
             (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) ||
             (/^https?:\/\/.*\.pages\.dev$/.test(origin));
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(body, init = {}, env, req) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(env, req),
      ...(init.headers || {}),
    },
  });
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function countWords(s) {
  if (!s) return 0;
  // For CJK text, count characters; for Latin/Thai, split on whitespace
  const cjk = (s.match(/[一-鿿]/g) || []).length;
  const latin = s.replace(/[一-鿿]+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return cjk + latin;
}

function checkBasicAuth(req, env) {
  const h = req.headers.get('Authorization') || '';
  const m = h.match(/^Basic\s+(.+)$/);
  if (!m) return false;
  try {
    const decoded = atob(m[1]);
    const idx = decoded.indexOf(':');
    if (idx < 0) return false;
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    return user === (env.DASHBOARD_USER || '') && pass === (env.DASHBOARD_PASS || '');
  } catch (e) { return false; }
}

async function handleSubmit(req, env) {
  let data;
  try { data = await req.json(); }
  catch (e) { return jsonResponse({ error: 'invalid_json' }, { status: 400 }, env, req); }

  const { question_id, question_text, answer_text, lang, anon_uuid } = data || {};

  // Validation
  if (typeof question_id !== 'string' || !question_id || question_id.length > 100)
    return jsonResponse({ error: 'bad_question_id' }, { status: 400 }, env, req);
  if (typeof question_text !== 'string' || question_text.length > MAX_QUESTION_LEN)
    return jsonResponse({ error: 'bad_question_text' }, { status: 400 }, env, req);
  if (typeof answer_text !== 'string' || !answer_text.trim() || answer_text.length > MAX_ANSWER_LEN)
    return jsonResponse({ error: 'bad_answer_text' }, { status: 400 }, env, req);
  if (typeof anon_uuid !== 'string' || !anon_uuid || anon_uuid.length > 100)
    return jsonResponse({ error: 'bad_anon_uuid' }, { status: 400 }, env, req);
  if (!['en', 'th', 'cn'].includes(lang || ''))
    return jsonResponse({ error: 'bad_lang' }, { status: 400 }, env, req);

  const salt = env.HASH_SALT || 'dao-default-salt-please-change';
  const anon_hash = await sha256Hex(salt + ':' + anon_uuid);

  const country = req.cf && req.cf.country ? String(req.cf.country) : null;
  const tz = req.cf && req.cf.timezone ? String(req.cf.timezone) : null;

  const now = Date.now();
  const wc = countWords(answer_text);

  try {
    await env.DB.prepare(
      `INSERT INTO entries (created_at, lang, question_id, question_text, answer_text, anon_hash, word_count, client_country, client_tz)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(now, lang, question_id, question_text, answer_text, anon_hash, wc, country, tz).run();

    await env.DB.prepare(
      `UPDATE counters SET value = value + 1 WHERE key = 'total_entries'`
    ).run();
  } catch (err) {
    return jsonResponse({ error: 'db_error', detail: String(err) }, { status: 500 }, env, req);
  }

  return jsonResponse({ ok: true, stored_at: now }, { status: 201 }, env, req);
}

async function handleCount(req, env) {
  try {
    const r = await env.DB.prepare(`SELECT value FROM counters WHERE key = 'total_entries'`).first();
    return jsonResponse({ total: (r && r.value) || 0 }, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    }, env, req);
  } catch (err) {
    return jsonResponse({ total: 0 }, {}, env, req);
  }
}

function htmlEscape(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function handleThemes(req, env) {
  if (!checkBasicAuth(req, env)) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="dao-checkin"' },
    });
  }

  // Top-line stats
  const total = await env.DB.prepare(`SELECT COUNT(*) as n FROM entries`).first();
  const unique = await env.DB.prepare(`SELECT COUNT(DISTINCT anon_hash) as n FROM entries`).first();
  const byLang = await env.DB.prepare(`SELECT lang, COUNT(*) as n FROM entries GROUP BY lang ORDER BY n DESC`).all();
  const byQ = await env.DB.prepare(`SELECT question_id, question_text, lang, COUNT(*) as n FROM entries GROUP BY question_id, lang ORDER BY n DESC LIMIT 50`).all();
  const recent = await env.DB.prepare(`SELECT created_at, lang, question_id, answer_text, word_count, client_country FROM entries ORDER BY created_at DESC LIMIT 25`).all();
  const wordTotals = await env.DB.prepare(`SELECT SUM(word_count) as total, AVG(word_count) as avg FROM entries`).first();

  const fmt = (ms) => {
    const d = new Date(ms);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  };

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>dao-checkin · themes</title>
<style>
  :root { color-scheme: light; }
  body { font: 14px/1.55 ui-monospace, "JetBrains Mono", Menlo, monospace; background: #f4ebd5; color: #1a1a1a; max-width: 1100px; margin: 24px auto; padding: 0 24px; }
  h1 { font: 400 22px/1.2 "Cormorant Garamond", Georgia, serif; letter-spacing: .02em; margin: 0 0 4px; }
  .kicker { font-size: 10px; letter-spacing: .25em; text-transform: uppercase; color: #777; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; }
  td, th { padding: 8px 10px; border-bottom: 1px solid rgba(0,0,0,.10); text-align: left; vertical-align: top; }
  th { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: #777; font-weight: 500; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .ans { font: 13px/1.55 "Cormorant Garamond", Georgia, serif; max-width: 60ch; }
  .meta { font-size: 10px; color: #888; letter-spacing: .05em; }
  .stats { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 20px; }
  .stat { border: 1px solid rgba(0,0,0,.20); padding: 12px 18px; min-width: 120px; }
  .stat .v { font: 400 28px/1 "Cormorant Garamond", Georgia, serif; }
  .stat .l { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #777; margin-top: 4px; }
</style></head>
<body>
  <p class="kicker">問 wèn · daily-reflection backend</p>
  <h1>What people are asking themselves on dao.nonarkara.org</h1>
  <div class="stats">
    <div class="stat"><div class="v">${(total && total.n) || 0}</div><div class="l">entries</div></div>
    <div class="stat"><div class="v">${(unique && unique.n) || 0}</div><div class="l">unique writers</div></div>
    <div class="stat"><div class="v">${Math.round((wordTotals && wordTotals.total) || 0)}</div><div class="l">words total</div></div>
    <div class="stat"><div class="v">${Math.round((wordTotals && wordTotals.avg) || 0)}</div><div class="l">words avg</div></div>
  </div>

  <h2 style="font:400 16px/1.3 Cormorant Garamond,serif;">By language</h2>
  <table>
    <thead><tr><th>Lang</th><th class="num">Count</th></tr></thead>
    <tbody>
      ${(byLang.results || []).map(r => `<tr><td>${htmlEscape(r.lang)}</td><td class="num">${r.n}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2 style="font:400 16px/1.3 Cormorant Garamond,serif;">Top questions</h2>
  <table>
    <thead><tr><th>Question</th><th>Lang</th><th class="num">Count</th></tr></thead>
    <tbody>
      ${(byQ.results || []).map(r => `<tr><td>${htmlEscape(r.question_text)}</td><td>${htmlEscape(r.lang)}</td><td class="num">${r.n}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2 style="font:400 16px/1.3 Cormorant Garamond,serif;">Recent entries</h2>
  <table>
    <thead><tr><th>When</th><th>Lang</th><th>Q</th><th>Answer</th></tr></thead>
    <tbody>
      ${(recent.results || []).map(r => `<tr>
        <td class="meta">${fmt(r.created_at)}<br>${htmlEscape(r.client_country || '')}</td>
        <td class="meta">${htmlEscape(r.lang)}</td>
        <td class="meta">${htmlEscape(r.question_id)}<br><span style="font-size:10px;color:#aaa">${r.word_count}w</span></td>
        <td class="ans">${htmlEscape(r.answer_text)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <p class="meta">No PII stored. anon_hash = SHA-256(salt + uuid). IP not logged.</p>
  <p class="meta"><a href="/entries.csv">Download all as CSV</a></p>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function handleCsv(req, env) {
  if (!checkBasicAuth(req, env)) {
    return new Response('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="dao-checkin"' },
    });
  }
  const all = await env.DB.prepare(
    `SELECT created_at, lang, question_id, question_text, answer_text, word_count, client_country, client_tz FROM entries ORDER BY created_at DESC`
  ).all();
  const csv = ['created_at,lang,question_id,question_text,answer_text,word_count,client_country,client_tz'];
  for (const r of (all.results || [])) {
    const row = [r.created_at, r.lang, r.question_id, r.question_text, r.answer_text, r.word_count, r.client_country, r.client_tz];
    csv.push(row.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
  }
  return new Response(csv.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="dao-checkin-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    // Preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env, req) });
    }

    if (req.method === 'POST' && url.pathname === '/submit') return handleSubmit(req, env);
    if (req.method === 'GET'  && url.pathname === '/count')  return handleCount(req, env);
    if (req.method === 'GET'  && url.pathname === '/themes') return handleThemes(req, env);
    if (req.method === 'GET'  && url.pathname === '/entries.csv') return handleCsv(req, env);

    if (url.pathname === '/' || url.pathname === '') {
      return new Response('dao-checkin · 道 · running', { headers: { 'Content-Type': 'text/plain' } });
    }
    return new Response('not found', { status: 404 });
  },
};
