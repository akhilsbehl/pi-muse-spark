# pi-muse-spark

Pi extension for [Meta Model API](https://dev.meta.ai) — adds **Muse Spark 1.2, 1.2-contributor & 1.1** to [pi coding agent](https://github.com/badlogic/pi-mono) via API key.

> **Fork note & credit:** This is a maintained fork of [`seemethere/pi-meta-ai`](https://github.com/seemethere/pi-meta-ai) which provides the original implementation for most of the work. Original credit goes to [seemethere/pi-meta-ai](https://github.com/seemethere/pi-meta-ai) and its contributors. This fork fixes the false `not authenticated` warning on `pi v0.84+` (where `authStorage` was removed) and keeps Muse Spark 1.2 models up to date. Upstream is currently unmaintained.

Meta Model API is OpenAI-compatible with Responses API at `https://api.meta.ai/v1`. This extension registers provider `meta-ai` using `openai-responses` for full agentic support: tool calling, parallel tools, streaming, reasoning effort, structured output, image input, prompt caching, 1M context.

## Prerequisites

- Node.js >=18
- Pi coding agent >=0.84:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi --version # should be >=0.84
```

## Install

**As pi package (recommended):**

```bash
pi install git:github.com/EclipseAditya/pi-muse-spark

# pin to a version:
pi install git:github.com/EclipseAditya/pi-muse-spark@v0.2.0
```

**From source (dev):**

```bash
git clone https://github.com/EclipseAditya/pi-muse-spark
cd pi-muse-spark
pi -e ./extensions/meta-model-api
```

**Migrate from `pi-meta-ai`:**

```bash
pi remove git:github.com/seemethere/pi-meta-ai
pi remove git:github.com/RooseveltAdvisors/pi-meta-ai
pi install git:github.com/EclipseAditya/pi-muse-spark
```

## Quick start

1. **Get API key:** https://dev.meta.ai → API keys → Create. Key format `LLM|...`

2. **Authenticate (pick one):**

   **Option A — Inside pi (recommended):**
   ```
   /login → API key → Meta Model API → paste LLM|... key
   ```

   **Option B — Env var (before launching pi):**
   ```bash
   export MODEL_API_KEY="LLM|..."
   # Also supports META_API_KEY as fallback
   
   pi
   # or from source:
   MODEL_API_KEY="LLM|..." pi -e ./extensions/meta-model-api
   ```

   > Env vars must be set **before** launching pi. If you set them after pi is running, run `/reload` or restart pi from the shell where var is exported.

3. **Select model:**
   ```
   /model → meta-ai/muse-spark-1.2-contributor
   # or meta-ai/muse-spark-1.2
   # or meta-ai/muse-spark-1.1
   ```

4. **Verify:**
   ```
   /meta status
   ```

5. Chat normally. Pi tools (read, bash, edit, write) work out of the box.

## Commands

- `/meta status` — show provider, masked key status, auth source (`stored`/`environment`/`runtime`), active model
- `/meta help` — usage help
- `/login` — manage API keys
- `/model` — switch models

## Features

- **API:** `openai-responses`
- **Tool calling:** parallel tools
- **Reasoning:** via pi thinking levels `minimal`, `low`, `medium`, `high`, `xhigh` → mapped to Meta `minimal`/`low`/`medium`/`high` (`xhigh` clamps to `high`)
- **Structured output:** JSON schema
- **Input:** text, image (PNG, JPEG, WebP, GIF)
- **Caching:** prompt caching automatic
- **Context:** 1M tokens, 64K max output
- **Models:**
  - `muse-spark-1.2` — $1.25/$4.25 per M (balanced)
  - `muse-spark-1.2-contributor` — $0.10/$0.20 per M (cheap, community)
  - `muse-spark-1.1` — free preview

## Why this fork?

- **Fixed bug:** `pi v0.84+` removed `ctx.modelRegistry.authStorage`. Original extension used `authStorage.get()` which always returned `undefined`, causing a false `Meta Model API not authenticated. Run /login...` warning even when `~/.pi/agent/auth.json` was correctly configured. This fork uses `getProviderAuthStatus()` — the canonical pi API — so `/login` via `auth.json` is correctly detected.
- **Active model detection:** Now correctly detects `muse-spark-1.2*` as active, not just `1.1`.
- **Upstream credit:** All provider/model logic, docs, and structure remain from [`seemethere/pi-meta-ai`](https://github.com/seemethere/pi-meta-ai). See `LICENSE` (MIT).

## Config reference (without extension)

If you prefer static config, create `~/.pi/agent/models.json` — see [`models.json.example`](./models.json.example):

```json
{
  "providers": {
    "meta-ai": {
      "baseUrl": "https://api.meta.ai/v1",
      "apiKey": "$MODEL_API_KEY",
      "api": "openai-responses",
      "models": [
        {
          "id": "muse-spark-1.2-contributor",
          "name": "Muse Spark 1.2 Contributor",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1048576,
          "maxTokens": 64000,
          "cost": { "input": 0.1, "output": 0.2, "cacheRead": 0.002, "cacheWrite": 0.002 }
        }
      ]
    }
  }
}
```

Extension install is recommended for better login UX and future updates.

## Troubleshooting

**Model not visible in `/model`:**
- Ensure extension is loaded: `pi list` should show `git:github.com/EclipseAditya/pi-muse-spark`
- Run `/reload` then `/model`
- Check `/meta status` shows `Provider registered: yes`

**`Meta Model API not authenticated` (fixed in this fork):**
- If you saw this with `seemethere/pi-meta-ai` on pi 0.84+, migrate to this fork (see Install).
- Run `/login → API key → Meta Model API` and paste `LLM|...` key
- Or `export MODEL_API_KEY=LLM|...` **before** launching pi, then `/reload`
- Verify with `/meta status` — should show `Resolved: yes ✓ ready (source: stored)`

**Invalid key error:**
- Key must start with `LLM|` from https://dev.meta.ai
- Re-create key at dev.meta.ai → API keys → Create
- Try `/logout meta-ai` then `/login` again

**Env var not picked up:**
- Export before launch: `export MODEL_API_KEY=... && pi`
- Inside running pi, `/reload` after export won't pick up new env if parent shell didn't have it — restart pi from shell where var is exported

## Security

- Never commit real API keys, `.env`, or `~/.pi/agent/auth.json`
- Use `/login` (stored in OS-protected `auth.json`) or env vars for keys
- Keys are displayed masked (e.g., `LLM|...abcd`) in `/meta status`
- See [SECURITY.md](./SECURITY.md)

## Development

```bash
npm install
npm run typecheck
pi -e ./extensions/meta-model-api/index.ts
# inside pi:
# /meta status
# /model → meta-ai/muse-spark-1.2-contributor
```

Structure:

```
pi-muse-spark/
  extensions/
    meta-model-api/
      index.ts      extension entry
  models.json.example
  package.json
```

## Credits

- **Original project:** [`seemethere/pi-meta-ai`](https://github.com/seemethere/pi-meta-ai) — most code, docs, and model definitions originate there. Thank you!
- **This fork:** Bug fixes for pi 0.84+, Muse Spark 1.2 support, ongoing maintenance by [EclipseAditya](https://github.com/EclipseAditya).
- **License:** MIT — see [LICENSE](./LICENSE) (same as upstream).

## License

MIT — see [LICENSE](./LICENSE)
