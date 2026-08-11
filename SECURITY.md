# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | :white_check_mark: |
| 0.1.x   | upstream only |

## Handling secrets

- Never commit API keys (`LLM|...`), `.env`, or `~/.pi/agent/auth.json`
- Use `pi` `/login` flow which stores keys in `~/.pi/agent/auth.json` (chmod 600) or env vars
- `/meta status` masks keys as `LLM|...abcd` — safe to share screenshots
- If you accidentally commit a key, rotate immediately at https://dev.meta.ai → API keys

## Reporting a Vulnerability

- Do NOT open a public issue for sensitive security reports
- Use GitHub Security Advisories: https://github.com/EclipseAditya/pi-muse-spark/security/advisories/new
- Upstream advisories (original): https://github.com/seemethere/pi-meta-ai/security/advisories/new
- Or open an issue marked as security concern with no secret details

We aim to respond within 5 business days.

## What to include

- Pi version, Node version, extension version
- Description of vulnerability without including real secrets
- Reproduction steps if applicable
