# AskAJ chat worker

Cloudflare Worker that proxies portfolio chat requests to the Anthropic Messages API
with AJ's system prompt baked in. Streams responses as SSE.

## Deploy

```bash
cd worker
npm install
npx wrangler login                          # one time, opens browser
npx wrangler secret put ANTHROPIC_API_KEY   # paste sk-ant-... key
npx wrangler deploy
```

Wrangler will print the Worker URL, e.g. `https://askaj-chat.<your-account>.workers.dev`.

Then in the portfolio root, expose the URL to the site:

```bash
echo "PUBLIC_CHAT_API_URL=https://askaj-chat.<your-account>.workers.dev" >> .env
```

Rebuild and redeploy the site. Done.

## Local dev

```bash
npx wrangler dev
# worker listens on http://127.0.0.1:8787
```

In the portfolio root:

```bash
echo "PUBLIC_CHAT_API_URL=http://127.0.0.1:8787" >> .env
npm run dev
```

## Edit the persona

`src/system-prompt.js` is the single source of truth for what AJ-the-bot knows
and how it behaves. Edit and redeploy.

## Cost ceiling

Default model is `claude-haiku-4-5-20251001`, `max_tokens: 600`, history capped at
16 turns. At Anthropic's published Haiku 4.5 pricing this is roughly $0.005 to
$0.015 per visitor chat. A 100-visitor day is under $2. Add a per-IP rate limit
with Cloudflare's free WAF if you want a hard cap.

## CORS

`src/index.js` allowlist contains `https://ajeenkya.github.io` and `localhost:4321`.
Add your custom domain there before going prod.
