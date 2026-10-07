import type { Lang } from "@/lib/highlight";

/*
 * Integration-pattern samples.
 * ATRX publishes no public API host, SDK package, header names, signature
 * scheme or payload schema, so every sample is written from the tenant's side
 * and keeps those details abstract. Do not add endpoints or field contracts
 * here unless they are documented.
 */

export type CodeSample = { id: string; label: string; lang: Lang; code: string };

export const heroSamples: CodeSample[] = [
  {
    id: "python",
    label: "Python",
    lang: "python",
    code: `# Verification parameters are supplied during ATRX onboarding.
def handle_atrx_payload(request):
    if not verify_atrx_signature(request):
        return reject(status=401)

    payload = request.json()
    directive = apply_desk_mandates(payload)
    risk_engine.route(directive)
    return accept()`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    lang: "javascript",
    code: `// Verification parameters are supplied during ATRX onboarding.
export async function handleAtrxPayload(request) {
  const verified = verifyAtrxSignature(request)
  if (!verified) return new Response(null, { status: 401 })

  const payload = await request.json()
  const directive = applyDeskMandates(payload)
  await riskEngine.route(directive)
  return new Response(null, { status: 202 })
}`,
  },
  {
    id: "payload",
    label: "Illustrative payload",
    lang: "json",
    code: `// Illustrative payload. Schema is issued during onboarding.
{
  "instrument": "MET_SAFE",
  "regime_tag": "…",
  "structural_identifier": "…",
  "directive": "…",
  "signature": "…"
}`,
  },
];

export type QuickstartCategory = {
  id: string;
  label: string;
  title: string;
  description: string;
  points: string[];
  tiers: { tier: string; text: string }[];
  href: string;
  samples: CodeSample[];
};

export const quickstart: QuickstartCategory[] = [
  {
    id: "webhooks",
    label: "Webhooks",
    title: "Zero-Latency Webhooks",
    description:
      "The ATRX intelligence cloud streams signed, schema-validated execution payloads directly to your server infrastructure.",
    points: ["Signed execution payloads", "Schema-validated JSON", "Replay-protected directives"],
    tiers: [
      { tier: "I", text: "Standard JSON webhook delivery" },
      { tier: "II", text: "Direct low-latency integration SDKs" },
    ],
    href: "/delivery/zero-latency-webhooks",
    samples: [
      {
        id: "python",
        label: "Python",
        lang: "python",
        code: `# Receive signed, schema-validated execution payloads.
# Verification parameters are supplied during ATRX onboarding.

def handle_atrx_payload(request):
    if not verify_atrx_signature(request):
        return reject(status=401)

    payload = request.json()
    ledger.append(payload)  # retain for your own audit review

    directive = apply_desk_mandates(payload)
    risk_engine.route(directive)  # your existing risk engine
    return accept()`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        lang: "javascript",
        code: `// Receive signed, schema-validated execution payloads.
// Verification parameters are supplied during ATRX onboarding.

export async function handleAtrxPayload(request) {
  const verified = verifyAtrxSignature(request)
  if (!verified) return new Response(null, { status: 401 })

  const payload = await request.json()
  await ledger.append(payload) // retain for your own audit review

  const directive = applyDeskMandates(payload)
  await riskEngine.route(directive) // your existing risk engine
  return new Response(null, { status: 202 })
}`,
      },
    ],
  },
  {
    id: "guardrails",
    label: "Guardrails",
    title: "Native Risk Mandates",
    description:
      "The execution node respects daily drawdown limits, exposure caps, and macroeconomic blackout windows natively.",
    points: ["Drawdown thresholds", "Exposure limits", "Macroeconomic blackout windows"],
    tiers: [
      { tier: "I", text: "Systemic guardrails enforced at the API level" },
      { tier: "II", text: "Custom regime-gating and drawdown parameterization" },
    ],
    href: "/control/native-risk-mandates",
    samples: [
      {
        id: "python",
        label: "Python",
        lang: "python",
        code: `# Desk mandates enforced inside your execution node.
# Names are illustrative; limits are set by your desk.
MANDATES = {
    "daily_drawdown_limit": desk.limits.daily_drawdown,
    "exposure_cap": desk.limits.gross_exposure,
    "blackout_windows": desk.calendar.macro_blackouts,
    "instruments": {"MET_SAFE", "FX_DM"},
}

def apply_desk_mandates(payload):
    if in_window(MANDATES["blackout_windows"]):
        return veto(payload, reason="macro_blackout")
    if breaches(payload, MANDATES):
        return veto(payload, reason="mandate_limit")
    return size(payload, scalar=desk.lot_scalar)`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        lang: "javascript",
        code: `// Desk mandates enforced inside your execution node.
// Names are illustrative; limits are set by your desk.
const mandates = {
  dailyDrawdownLimit: desk.limits.dailyDrawdown,
  exposureCap: desk.limits.grossExposure,
  blackoutWindows: desk.calendar.macroBlackouts,
  instruments: new Set(["MET_SAFE", "FX_DM"]),
}

export function applyDeskMandates(payload) {
  if (inWindow(mandates.blackoutWindows)) {
    return veto(payload, "macro_blackout")
  }
  if (breaches(payload, mandates)) return veto(payload, "mandate_limit")
  return size(payload, { scalar: desk.lotScalar })
}`,
      },
    ],
  },
  {
    id: "attribution",
    label: "Attribution",
    title: "Causal Attribution",
    description:
      "Every execution payload carries a regime tag and a structural identifier.",
    points: ["Regime tag on every payload", "Structural identifier", "P&L by catalyst and volatility state"],
    tiers: [],
    href: "/capabilities/causal-attribution",
    samples: [
      {
        id: "python",
        label: "Python",
        lang: "python",
        code: `# Attribute realised P&L to the classification each payload carries.
# Field names are illustrative; the schema is issued during onboarding.
from collections import defaultdict

pnl = defaultdict(float)
for fill in desk.fills(period="month"):
    tag = fill.payload["regime_tag"]
    structure = fill.payload["structural_identifier"]
    pnl[(tag, structure)] += fill.realised_pnl

for (tag, structure), value in sorted(pnl.items()):
    print(f"{tag:<18} {structure:<22} {value:>12,.2f}")`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        lang: "javascript",
        code: `// Attribute realised P&L to the classification each payload carries.
// Field names are illustrative; the schema is issued during onboarding.
const pnl = new Map()

for (const fill of await desk.fills({ period: "month" })) {
  const { regime_tag, structural_identifier } = fill.payload
  const key = \`\${regime_tag} · \${structural_identifier}\`
  pnl.set(key, (pnl.get(key) ?? 0) + fill.realisedPnl)
}

console.table(Object.fromEntries(pnl))`,
      },
    ],
  },
  {
    id: "audit",
    label: "Audit telemetry",
    title: "Audit-Grade Ledgers",
    description:
      "Decision logs, state classifications, and risk veto events are exported in machine-readable formats.",
    points: ["Decision logs", "State classifications", "Risk veto events"],
    tiers: [{ tier: "III", text: "Audit-grade telemetry logs for governance" }],
    href: "/delivery/audit-grade-ledgers",
    samples: [
      {
        id: "python",
        label: "Python",
        lang: "python",
        code: `# Review an exported ATRX ledger during governance review.
# Export format and field names are confirmed during onboarding.
import json

with open("atrx_ledger_export.json") as f:
    records = json.load(f)

vetoes = [r for r in records if r["event"] == "risk_veto"]
states = {r["state_classification"] for r in records}

print(f"{len(records)} decisions, {len(vetoes)} risk vetoes")
print("States observed:", ", ".join(sorted(states)))`,
      },
      {
        id: "javascript",
        label: "JavaScript",
        lang: "javascript",
        code: `// Review an exported ATRX ledger during governance review.
// Export format and field names are confirmed during onboarding.
import { readFile } from "node:fs/promises"

const raw = await readFile("atrx_ledger_export.json", "utf8")
const records = JSON.parse(raw)

const vetoes = records.filter((r) => r.event === "risk_veto")
const states = new Set(records.map((r) => r.state_classification))

console.log(\`\${records.length} decisions, \${vetoes.length} risk vetoes\`)
console.log("States observed:", [...states].sort().join(", "))`,
      },
    ],
  },
];
