/**
 * Pi Extension: Meta Model API (Muse Spark)
 *
 * Provides Meta's Muse Spark models via api.meta.ai using API key authentication.
 * OpenAI Responses-compatible with tool calling, reasoning, structured output,
 * image input, and prompt caching.
 *
 * Forked from https://github.com/seemethere/pi-meta-ai
 * Original work by seemethere/pi-meta-ai contributors.
 * This fork fixes pi v0.84+ auth detection (getProviderAuthStatus) and adds
 * Muse Spark 1.3 / 1.3-contributor / 1.2 / 1.2-contributor models.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const PROVIDER_ID = "meta-ai";
const DISPLAY_NAME = "Meta Model API";
const BASE_URL = "https://api.meta.ai/v1";
const MODEL_ID = "muse-spark-1.1";
const MODEL_ID_12 = "muse-spark-1.2";
const MODEL_ID_12_CONTRIB = "muse-spark-1.2-contributor";
const MODEL_ID_13 = "muse-spark-1.3";
const MODEL_ID_13_CONTRIB = "muse-spark-1.3-contributor";
const ENV_VAR = "MODEL_API_KEY";
const META_ENV_VAR = "META_API_KEY";

function maskKey(key: string): string {
  if (!key) return "(none)";
  if (key.length <= 12) return "***";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

function getEnvKey(): string | undefined {
  return process.env[ENV_VAR] || process.env[META_ENV_VAR];
}

export default function (pi: ExtensionAPI) {
  // Allow META_API_KEY as fallback — shim to MODEL_API_KEY so pi's $MODEL_API_KEY interpolation works.
  if (!process.env[ENV_VAR] && process.env[META_ENV_VAR]) {
    process.env[ENV_VAR] = process.env[META_ENV_VAR];
  }

  pi.registerProvider(PROVIDER_ID, {
    name: DISPLAY_NAME,
    baseUrl: BASE_URL,
    // Pi will resolve key from: 1) auth.json (api_key), 2) $MODEL_API_KEY env var.
    apiKey: `$${ENV_VAR}`,
    api: "openai-responses",
    models: [
      {
        id: MODEL_ID_13,
        name: "Muse Spark 1.3",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 64_000,
        thinkingLevelMap: {
          off: "minimal",
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "high",
          max: "high",
        },
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: true,
          supportsUsageInStreaming: true,
        },
      },
      {
        id: MODEL_ID_13_CONTRIB,
        name: "Muse Spark 1.3 Contributor",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0.10, output: 0.20, cacheRead: 0.002, cacheWrite: 0.002 },
        contextWindow: 1_048_576,
        maxTokens: 64_000,
        thinkingLevelMap: {
          off: "minimal",
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "high",
          max: "high",
        },
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: true,
          supportsUsageInStreaming: true,
        },
      },
      {
        id: MODEL_ID_12,
        name: "Muse Spark 1.2",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 1.25, output: 4.25, cacheRead: 0.15, cacheWrite: 0.15 },
        contextWindow: 1_048_576,
        maxTokens: 64_000,
        thinkingLevelMap: {
          off: "minimal",
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "high",
          max: "high",
        },
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: true,
          supportsUsageInStreaming: true,
        },
      },
      {
        id: MODEL_ID_12_CONTRIB,
        name: "Muse Spark 1.2 Contributor",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0.10, output: 0.20, cacheRead: 0.002, cacheWrite: 0.002 },
        contextWindow: 1_048_576,
        maxTokens: 64_000,
        thinkingLevelMap: {
          off: "minimal",
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "high",
          max: "high",
        },
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: true,
          supportsUsageInStreaming: true,
        },
      },
      {
        id: MODEL_ID,
        name: "Muse Spark 1.1",
        reasoning: true,
        input: ["text", "image"],
        // Pricing is currently free preview for Meta Model API. Revisit before GA if pricing is published.
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1_048_576,
        maxTokens: 64_000,
        thinkingLevelMap: {
          off: "minimal",
          minimal: "minimal",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: "high",
          max: "high",
        },
        compat: {
          supportsReasoningEffort: true,
          supportsDeveloperRole: true,
          supportsUsageInStreaming: true,
        },
      },
    ],
  });

  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.setStatus("meta-ai", undefined);

    // Check provider registration (any of the models should be registered)
    const isRegistered =
      !!ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID) ||
      !!ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_12) ||
      !!ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_12_CONTRIB) ||
      !!ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_13) ||
      !!ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_13_CONTRIB) ||
      !!ctx.modelRegistry.getProvider(PROVIDER_ID);

    if (!isRegistered) {
      ctx.ui.notify(`Meta provider not registered correctly. Try /reload or reinstall extension.`, "error");
      return;
    }

    // Fixed: pi v0.84+ removed ctx.modelRegistry.authStorage; use getProviderAuthStatus.
    // This correctly detects auth.json (stored), env var, and runtime keys.
    const authStatus = ctx.modelRegistry.getProviderAuthStatus(PROVIDER_ID);
    const isAuthenticated = authStatus.configured || !!getEnvKey();

    if (!isAuthenticated) {
      ctx.ui.notify(
        `Meta Model API not authenticated. Run /login → API key → '${DISPLAY_NAME}' to add your key, or export ${ENV_VAR}=LLM|... before launching pi. Then /model → ${PROVIDER_ID}/${MODEL_ID_13_CONTRIB}`,
        "warning"
      );
    }
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    ctx.ui.setStatus("meta-ai", undefined);
  });

  pi.registerCommand("meta", {
    description: "Meta Model API status and help",
    handler: async (args, ctx) => {
      const sub = (args || "").trim().split(/\s+/)[0] || "status";

      if (sub === "status") {
        const envKey = getEnvKey();
        const provider = ctx.modelRegistry.getProvider(PROVIDER_ID);
        const model11 = ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID);
        const model12 = ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_12);
        const model12c = ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_12_CONTRIB);
        const model13 = ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_13);
        const model13c = ctx.modelRegistry.find(PROVIDER_ID, MODEL_ID_13_CONTRIB);
        const authStatus = ctx.modelRegistry.getProviderAuthStatus(PROVIDER_ID);
        const isActiveProvider = ctx.model?.provider === PROVIDER_ID;
        const activeModelId = ctx.model?.id ?? "(none)";
        const hasAuth = authStatus.configured || !!envKey;

        // authStatus.source is "stored" | "environment" | "runtime" | undefined
        // Stored keys are not readable for masking via this API (by design), so we show source.
        let storedInfo: string;
        if (authStatus.configured && authStatus.source === "stored") {
          storedInfo = `api_key (stored in auth.json) ✓`;
        } else if (authStatus.configured && authStatus.source === "environment") {
          storedInfo = `configured via environment (${(authStatus as any).label ?? ENV_VAR})`;
        } else if (authStatus.configured && authStatus.source === "runtime") {
          storedInfo = `runtime key set`;
        } else if (authStatus.configured) {
          storedInfo = `configured (source: ${authStatus.source ?? "unknown"}) ✓`;
        } else {
          storedInfo = "(not in auth.json — run /login)";
        }

        const lines = [
          `${DISPLAY_NAME} — Status`,
          `────────────────────────────────────────`,
          `Provider: ${PROVIDER_ID} (${DISPLAY_NAME})`,
          `Base URL: ${BASE_URL}`,
          `Models:`,
          `  ${MODEL_ID_13} — Muse Spark 1.3 (1M ctx, $1.25/$4.25 per M) ${model13 ? "✓" : "✗"}`,
          `  ${MODEL_ID_13_CONTRIB} — Muse Spark 1.3 Contributor (1M ctx, $0.10/$0.20 per M) ${model13c ? "✓" : "✗"}`,
          `  ${MODEL_ID_12} — Muse Spark 1.2 (1M ctx, $1.25/$4.25 per M) ${model12 ? "✓" : "✗"}`,
          `  ${MODEL_ID_12_CONTRIB} — Muse Spark 1.2 Contributor (1M ctx, $0.10/$0.20 per M) ${model12c ? "✓" : "✗"}`,
          `  ${MODEL_ID} — Muse Spark 1.1 (1M ctx, free preview) ${model11 ? "✓" : "✗"}`,
          `  API: openai-responses`,
          ``,
          `Auth:`,
          `  Env ${ENV_VAR}: ${envKey ? maskKey(envKey) : "(not set)"} ${process.env[META_ENV_VAR] ? `(fallback ${META_ENV_VAR} detected)` : ""}`,
          `  auth.json: ${storedInfo}`,
          `  Resolved: ${hasAuth ? `yes ✓ ready (source: ${authStatus.source ?? (envKey ? "environment" : "stored")})` : "no — run /login or set env var"}`,
          ``,
          `State:`,
          `  Provider registered: ${provider ? "yes ✓" : "no ✗"}`,
          `  Active model: ${isActiveProvider ? `yes ✓ (${activeModelId})` : `no — use /model to select ${PROVIDER_ID}/${MODEL_ID_13_CONTRIB}`}`,
          ``,
          `Next steps:`,
          `  1. /login → API key → "${DISPLAY_NAME}" → paste LLM|... key`,
          `  2. /model → ${PROVIDER_ID}/${MODEL_ID_13_CONTRIB}`,
          `  3. Ask anything — pi tools (read, bash, edit, write) work out of the box`,
          ``,
          `Env alternative: export ${ENV_VAR}=LLM|... then /reload (also supports ${META_ENV_VAR})`,
        ];

        ctx.ui.notify(lines.join("\n"), hasAuth ? "info" : "warning");
        return;
      }

      if (sub === "help") {
        ctx.ui.notify(
          [
            `${DISPLAY_NAME} — Pi Extension`,
            ``,
            `Commands:`,
            `  /meta status — show key status (masked), auth source, active model`,
            `  /meta help   — this help`,
            `  /login       — add your key via API key → Meta Model API`,
            `  /model       — select a Meta model (muse-spark-1.3, muse-spark-1.3-contributor, muse-spark-1.2, muse-spark-1.2-contributor, muse-spark-1.1)`,
            ``,
            `Setup:`,
            `  1. Get key: https://dev.meta.ai → API keys → Create (LLM|...)`,
            `  2. Export or login:`,
            `     export MODEL_API_KEY=LLM|...   (before launching pi)`,
            `     or inside pi: /login → API key → Meta Model API`,
            `  3. /model → meta-ai/muse-spark-1.3-contributor (or muse-spark-1.3)`,
            ``,
            `Docs: https://dev.meta.ai/docs`,
            `Source: https://github.com/nicklambourne/pi-muse-spark (fork of https://github.com/EclipseAditya/pi-muse-spark → https://github.com/seemethere/pi-meta-ai)`,
          ].join("\n"),
          "info"
        );
        return;
      }

      ctx.ui.notify(`Unknown subcommand "${sub}". Try /meta status or /meta help`, "warning");
    },
  });
}
