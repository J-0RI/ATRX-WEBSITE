/** Canonical request content, grounded in content/tiers.ts and the technical library. */
type RequestField = {
  key: string;
  label: string;
  kind: "text" | "textarea";
  required?: boolean;
  hint?: string;
};
type EngagementConfig = {
  label: string;
  heading: string;
  description: string;
  subject: string;
  action: string;
  fields: readonly RequestField[];
};

export const engagements = {
  "tier-1": {
    label: "Prosumer Node",
    heading: "Application",
    description: "Evaluate a single-tenant execution pipeline with systemic guardrails at the API level. Share your intended deployment and current execution or research environment.",
    subject: "ATRX — Prosumer Node application",
    action: "Prepare application",
    fields: [
      { key: "objective", label: "Primary deployment objective", kind: "textarea", required: true },
      { key: "markets", label: "Markets / instruments of interest", kind: "text", hint: "Prosumer Node covers the core FX and Metals vectors. Describe your interests; this does not confirm instrument availability." },
      { key: "environment", label: "Current execution or research environment", kind: "text" },
      { key: "constraints", label: "Relevant constraints / additional context", kind: "textarea" },
    ],
  },
  "tier-2": {
    label: "Capital Desk",
    heading: "Application",
    description: "Evaluate multi-node deployment for cohort allocation, with custom regime-gating and drawdown parameterization. Outline your desk’s integration objective and operational context.",
    subject: "ATRX — Capital Desk application",
    action: "Prepare application",
    fields: [
      { key: "desk", label: "Desk / team context", kind: "text" },
      { key: "markets", label: "Primary markets / instruments", kind: "text", hint: "Describe the markets relevant to your desk, including any interest in the expanded Indices and Energy topology." },
      { key: "objective", label: "Integration and deployment objective", kind: "textarea", required: true },
      { key: "environment", label: "Existing risk / execution environment", kind: "textarea" },
      { key: "constraints", label: "Additional operational constraints", kind: "textarea" },
    ],
  },
  "tier-3": {
    label: "Institutional",
    heading: "Application",
    description: "Evaluate a dedicated inference cluster with bespoke structural topology and audit-grade telemetry. Share the infrastructure, integration and governance context for your deployment.",
    subject: "ATRX — Institutional deployment inquiry",
    action: "Prepare application",
    fields: [
      { key: "scope", label: "Deployment scope", kind: "text", required: true },
      { key: "infrastructure", label: "Infrastructure / environment context", kind: "text", hint: "Describe your current environment and any relevant AWS or GCP context." },
      { key: "integration", label: "Integration requirements", kind: "textarea" },
      { key: "governance", label: "Governance / risk requirements", kind: "textarea" },
      { key: "telemetry", label: "Audit / telemetry requirements", kind: "textarea" },
      { key: "objective", label: "Deployment objective / additional context", kind: "textarea", required: true },
    ],
  },
  documentation: {
    label: "Technical Documentation / Ablation Studies",
    heading: "Documentation request",
    description: "Request technical materials maintained for qualified quantitative evaluators and capital allocators. Specify the research you need and the questions informing your evaluation.",
    subject: "ATRX — Technical documentation request",
    action: "Prepare documentation request",
    fields: [
      { key: "materials", label: "Materials requested", kind: "text", required: true, hint: "For example: the Systemic Macro Intelligence whitepaper, Phase 1 ablation studies, Structural Philosophy or Risk Disclosure." },
      { key: "evaluation", label: "Evaluation context", kind: "textarea", required: true },
      { key: "interests", label: "Areas of technical interest", kind: "text" },
      { key: "notes", label: "Questions / notes", kind: "textarea" },
    ],
  },
} as const satisfies Record<string, EngagementConfig>;

export type Engagement = keyof typeof engagements;
export type Identity = { name: string; entity: string; role: string };
export type EngagementAnswers = {
  [K in Engagement]: Record<(typeof engagements)[K]["fields"][number]["key"], string>;
};
export const engagementOptions = Object.keys(engagements) as Engagement[];
export const requestFields = (engagement: Engagement): readonly RequestField[] => engagements[engagement].fields;

export function parseEngagement(value: string | null): Engagement | "" {
  return value && Object.hasOwn(engagements, value) ? value as Engagement : "";
}

export function emptyEngagementAnswers(): EngagementAnswers {
  return Object.fromEntries(engagementOptions.map((engagement) => [
    engagement,
    Object.fromEntries(requestFields(engagement).map(({ key }) => [key, ""])),
  ])) as EngagementAnswers;
}

/** Only the selected schema is serialized; blank optional answers are omitted. */
export function prepareRequest(engagement: Engagement, identity: Identity, answers: Readonly<Record<string, string>>) {
  const config = engagements[engagement];
  const common = (["name", "entity", "role"] as const)
    .filter((key) => identity[key].trim())
    .map((key) => `${key[0].toUpperCase()}${key.slice(1)}: ${identity[key].trim()}`);
  const context = requestFields(engagement)
    .filter(({ key }) => answers[key]?.trim())
    .map(({ key, label }) => `${label}:\n${answers[key].trim()}`);
  return {
    subject: config.subject,
    body: [...common, `Engagement: ${config.label}`, "", ...context].join("\n\n"),
  };
}

export function requestMailto(destination: string, request: ReturnType<typeof prepareRequest>) {
  return `mailto:${destination}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
}
