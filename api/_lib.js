// Dishari OS, shared server helpers for Vercel serverless functions (Node 18+).
// The same retrieval/guardrail core runs in the browser and on the server.
const KB = require('../public/assets/js/data/kb.js');
const RAG = require('../public/assets/js/engine/rag.js');

const INDEX = RAG.buildIndex(KB);
const MODEL = process.env.DISHARI_MODEL || 'claude-sonnet-5-5';
const VISION_MODEL = process.env.DISHARI_VISION_MODEL || MODEL;
const KEY = process.env.ANTHROPIC_API_KEY || '';

// Best-effort per-instance rate limit (production: Upstash/Redis or Vercel KV).
const hits = new Map();
function rateLimited(req, perMin) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon';
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > perMin;
}

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve) => {
    let d = '';
    req.on('data', (c) => { d += c; if (d.length > 6e6) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch (e) { resolve({}); } });
  });
}

// Anthropic Messages API (zero-retention should be enabled on the organisation account).
async function callClaude({ system, content, model, maxTokens }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: model || MODEL, max_tokens: maxTokens || 400, system, messages: [{ role: 'user', content }] })
  });
  if (!r.ok) throw new Error('LLM HTTP ' + r.status);
  const j = await r.json();
  return (j.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
}

module.exports = { KB, RAG, INDEX, MODEL, VISION_MODEL, KEY, rateLimited, send, readBody, callClaude };
