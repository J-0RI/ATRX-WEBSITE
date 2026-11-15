/** Canonical request content, grounded in content/tiers.ts and the technical library. */
import { accessPlans, findPlan, tiers, type AccessPlan, type ModeId, type Tier } from "@/content/tiers";
import { REGION_NOT_APPLICABLE, resolveLocation, type Location } from "@/lib/geography";

type RequestField = {
  key: string;
  label: string;
  kind: "text" | "textarea";
  required?: boolean;
  hint?: string;
};
type EngagementConfig = {
  /** Access mode this engagement applies for; absent for non-access requests. */
  mode?: ModeId;
  label: string;
  heading: string;
  description: string;
  subject: string;
  action: string;
  fields: readonly RequestField[];
};

const modeName = (mode: ModeId) => tiers.find((tier) => tier.id === mode)!.name;

export const engagements = {
  "tier-1": {
    mode: "prosumer-node",
    label: modeName("prosumer-node"),
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
    mode: "capital-desk",
    label: modeName("capital-desk"),
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
    mode: "institutional",
    label: modeName("institutional"),
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
export type Identity = { name: string; entity: string; role: string; country: string; region: string };
export type EngagementAnswers = {
  [K in Engagement]: Record<(typeof engagements)[K]["fields"][number]["key"], string>;
};
export const engagementOptions = Object.keys(engagements) as Engagement[];
export const requestFields = (engagement: Engagement): readonly RequestField[] => engagements[engagement].fields;

export function parseEngagement(value: string | null): Engagement | "" {
  return value && Object.hasOwn(engagements, value) ? value as Engagement : "";
}

/** Access mode for an engagement; undefined for the documentation pathway or no selection. */
export function modeOf(engagement: Engagement | ""): ModeId | undefined {
  return engagement ? (engagements[engagement] as EngagementConfig).mode : undefined;
}

/** Plans offered for an engagement, straight from the /explore catalogue. */
export function plansFor(engagement: Engagement | ""): AccessPlan[] {
  const mode = modeOf(engagement);
  return mode ? accessPlans[mode] : [];
}

/** Plan id only if it belongs to the engagement's mode; otherwise "" (obsolete or cross-mode). */
export function parsePlan(engagement: Engagement | "", planId: string | null): string {
  const mode = modeOf(engagement);
  return (mode && findPlan(mode, planId)?.id) || "";
}

export function emptyEngagementAnswers(): EngagementAnswers {
  return Object.fromEntries(engagementOptions.map((engagement) => [
    engagement,
    Object.fromEntries(requestFields(engagement).map(({ key }) => [key, ""])),
  ])) as EngagementAnswers;
}

export type ApplicationField = "engagement" | "plan" | "country" | "region";

/** The qualification selections of a submission, resolved to stable ids plus readable names. */
export type Application = {
  engagement: Engagement;
  mode?: Pick<Tier, "id" | "name">;
  plan?: Pick<AccessPlan, "id" | "name">;
  location: Location;
};

/**
 * Submission boundary check. Re-resolves every selection against the catalogue and the
 * geography dataset, so empty, stale or manipulated values cannot reach the request.
 */
export function validateApplication(engagementValue: string, planId: string, identity: Pick<Identity, "country" | "region">):
  | { ok: true; application: Application }
  | { ok: false; field: ApplicationField; message: string } {
  const engagement = parseEngagement(engagementValue);
  if (!engagement) return { ok: false, field: "engagement", message: "Select an engagement." };
  const mode = modeOf(engagement);
  let plan: AccessPlan | undefined;
  if (mode) {
    plan = findPlan(mode, planId);
    if (!plan) return { ok: false, field: "plan", message: "Select a plan." };
  }
  const located = resolveLocation(identity.country, identity.region);
  if (!located.ok) return located;
  const tier = mode ? tiers.find((t) => t.id === mode)! : undefined;
  return {
    ok: true,
    application: {
      engagement,
      mode: tier && { id: tier.id, name: tier.name },
      plan: plan && { id: plan.id, name: plan.name },
      location: located.location,
    },
  };
}

/** Only the selected schema is serialized; blank optional answers are omitted. */
export function prepareRequest(application: Application, identity: Identity, answers: Readonly<Record<string, string>>) {
  const { engagement, mode, plan, location } = application;
  const config = engagements[engagement];
  const common = (["name", "entity", "role"] as const)
    .filter((key) => identity[key].trim())
    .map((key) => `${key[0].toUpperCase()}${key.slice(1)}: ${identity[key].trim()}`);
  const selections = [
    `Country: ${location.country.name} (${location.country.code})`,
    location.region.id === REGION_NOT_APPLICABLE
      ? `State / Province / Region: ${location.region.name}`
      : `State / Province / Region: ${location.region.name} (${location.region.id})`,
    mode ? `Access mode: ${mode.name} (${mode.id})` : `Engagement: ${config.label}`,
    ...(plan ? [`Plan: ${plan.name} (${plan.id})`] : []),
  ];
  const context = requestFields(engagement)
    .filter(({ key }) => answers[key]?.trim())
    .map(({ key, label }) => `${label}:\n${answers[key].trim()}`);
  return {
    subject: plan ? `${config.subject} — ${plan.name}` : config.subject,
    body: [...common, ...selections, "", ...context].join("\n\n"),
  };
}

export function requestMailto(destination: string, request: ReturnType<typeof prepareRequest>) {
  return `mailto:${destination}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
}
