// AskAJ chat backend - Cloudflare Worker
// Proxies portfolio chat -> Anthropic Messages API with AJ's system prompt.
// Streams responses as SSE so the UI can render token-by-token.
//
// Deploy:
//   cd worker
//   npm install
//   npx wrangler secret put ANTHROPIC_API_KEY   # paste your sk-ant-... key
//   npx wrangler deploy
//
// Test local:
//   npx wrangler dev

import SYSTEM_PROMPT from './system-prompt.js';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 600;
const MAX_TURNS = 16; // truncate older history past this

const ALLOWED_ORIGINS = new Set([
  'https://ajeenkya.github.io',
  'http://localhost:4321',
  'http://localhost:3000',
]);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://ajeenkya.github.io';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response('method not allowed', { status: 405, headers: cors });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'invalid json' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : [];
    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize: only role+content, strings only.
    const safeMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: safeMessages,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      return new Response(JSON.stringify({ error: 'upstream error', detail: errText.slice(0, 400) }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Stream Anthropic SSE straight through.
    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...cors,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, no-transform',
        'Connection': 'keep-alive',
      },
    });
  },
};
