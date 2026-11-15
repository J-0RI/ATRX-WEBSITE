/** Canonical request content, grounded in content/tiers.ts and the technical library. */
import { accessPlans, findPlan, tiers, type AccessPlan, type ModeId, type Tier } from "@/content/tiers";
import { REGION_NOT_APPLICABLE, resolveLocation, type Location } from "@/lib/geography";
import { resolvePhone, type Phone } from "@/lib/phone";

type RequestField = {
  key: string;
  label: string;
  kind: "text" | "textarea";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
};

/** Whether a contact field is asked for, and if so whether it is compulsory, for an engagement. */
type Requirement = "required" | "optional" | "omitted";
type ContactPolicy = {
  emailLabel: "Business email" | "Email address";
  phone: Exclude<Requirement, "omitted">;
  organization: Exclude<Requirement, "omitted">;
  jobTitle: Requirement;
  primaryFunction: Requirement;
  website: Requirement;
};

/** Independent applicants: no organisation is required, and none has to be invented. */
const individualContact: ContactPolicy = {
  emailLabel: "Email address", phone: "required", organization: "optional", jobTitle: "optional", primaryFunction: "optional", website: "omitted",
};
const organisationContact: ContactPolicy = {
  emailLabel: "Business email", phone: "required", organization: "required", jobTitle: "required", primaryFunction: "required", website: "omitted",
};
/** Documentation needs only enough to send and follow up on the materials. */
const documentationContact: ContactPolicy = {
  emailLabel: "Email address", phone: "optional", organization: "optional", jobTitle: "omitted", primaryFunction: "omitted", website: "omitted",
};

export const INTENDED_USE_MAX = 600;
const intendedUse: RequestField = {
  key: "intendedUse",
  label: "Intended use",
  kind: "textarea",
  required: true,
  maxLength: INTENDED_USE_MAX,
  placeholder: "Briefly describe your intended use of ATRX",
  hint: `Briefly describe what you expect to evaluate or use ATRX for, in up to ${INTENDED_USE_MAX} characters. Do not include confidential strategies, models, positions, holdings or account details.`,
};
type EngagementConfig = {
  /** Access mode this engagement applies for; absent for non-access requests. */
  mode?: ModeId;
  label: string;
  heading: string;
  description: string;
  subject: string;
  action: string;
  contact: ContactPolicy;
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
    contact: individualContact,
    fields: [
      intendedUse,
      { key: "markets", label: "Markets / instruments of interest", kind: "text", placeholder: "e.g. EUR/USD, XAU/USD", hint: "Prosumer Node covers the core FX and Metals vectors. Describe your interests; this does not confirm instrument availability." },
      { key: "environment", label: "Current execution or research environment", kind: "text", placeholder: "e.g. Python research stack, broker API" },
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
    contact: organisationContact,
    fields: [
      intendedUse,
      { key: "desk", label: "Desk / team context", kind: "text", placeholder: "e.g. Macro desk, four portfolio managers" },
      { key: "markets", label: "Primary markets / instruments", kind: "text", placeholder: "e.g. G10 FX, gold, equity indices", hint: "Describe the markets relevant to your desk, including any interest in the expanded Indices and Energy topology." },
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
    contact: { ...organisationContact, website: "optional" },
    fields: [
      intendedUse,
      { key: "scope", label: "Deployment scope", kind: "text", required: true, placeholder: "e.g. Two regional trading desks" },
      { key: "infrastructure", label: "Infrastructure / environment context", kind: "text", placeholder: "e.g. AWS, on-premises data centre", hint: "Describe your current environment and any relevant AWS or GCP context." },
      { key: "integration", label: "Integration requirements", kind: "textarea" },
      { key: "governance", label: "Governance / risk requirements", kind: "textarea" },
      { key: "telemetry", label: "Audit / telemetry requirements", kind: "textarea" },
    ],
  },
  documentation: {
    label: "Technical Documentation / Ablation Studies",
    heading: "Documentation request",
    description: "Request technical materials maintained for qualified quantitative evaluators and capital allocators. Specify the research you need and the questions informing your evaluation.",
    subject: "ATRX — Technical documentation request",
    action: "Prepare documentation request",
    contact: documentationContact,
    fields: [
      { key: "materials", label: "Materials requested", kind: "text", required: true, placeholder: "e.g. Phase 1 ablation studies", hint: "For example: the Systemic Macro Intelligence whitepaper, Phase 1 ablation studies, Structural Philosophy or Risk Disclosure." },
      { key: "evaluation", label: "Evaluation context", kind: "textarea", required: true, placeholder: "Briefly describe what you are evaluating" },
      { key: "interests", label: "Areas of technical interest", kind: "text" },
      { key: "notes", label: "Questions / notes", kind: "textarea" },
    ],
  },
} as const satisfies Record<string, EngagementConfig>;

export type Engagement = keyof typeof engagements;
/** Raw contact inputs as typed; only `validateApplication` output is ever serialised. */
export type Identity = {
  name: string;
  email: string;
  phoneCountry: string;
  phone: string;
  organization: string;
  jobTitle: string;
  primaryFunction: string;
  /** Free-text function; only meaningful (and only submitted) when primaryFunction is "other". */
  primaryFunctionOther: string;
  website: string;
  country: string;
  region: string;
};
export const emptyIdentity = (): Identity => ({
  name: "", email: "", phoneCountry: "", phone: "", organization: "", jobTitle: "", primaryFunction: "", primaryFunctionOther: "", website: "", country: "", region: "",
});

export const primaryFunctions = [
  { id: "investment-research", label: "Investment research" },
  { id: "portfolio-management", label: "Portfolio management" },
  { id: "quantitative-research", label: "Quantitative research" },
  { id: "trading-execution", label: "Trading and execution" },
  { id: "risk-management", label: "Risk management" },
  { id: "technology-infrastructure", label: "Technology and infrastructure" },
  { id: "other", label: "Other" },
] as const;
type PrimaryFunction = (typeof primaryFunctions)[number];

export const OTHER_FUNCTION = "other";
export const limits = { name: 120, primaryFunctionOther: 120, email: 254, organization: 160, jobTitle: 120, website: 200, text: 200, textarea: 2000 } as const;
export type EngagementAnswers = {
  [K in Engagement]: Record<(typeof engagements)[K]["fields"][number]["key"], string>;
};
export const engagementOptions = Object.keys(engagements) as Engagement[];
export const requestFields = (engagement: Engagement): readonly RequestField[] => engagements[engagement].fields;
export const contactPolicy = (engagement: Engagement): ContactPolicy => (engagements[engagement] as EngagementConfig).contact;
export const fieldLimit = (field: RequestField) => field.maxLength ?? limits[field.kind];

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

/** Form control names a validation error can point at. */
export type ApplicationField = string;
export type FieldErrors = Partial<Record<ApplicationField, string>>;

/** The validated, normalised submission. Only fields that apply to the engagement are present. */
export type Application = {
  engagement: Engagement;
  mode?: Pick<Tier, "id" | "name">;
  plan?: Pick<AccessPlan, "id" | "name">;
  contact: {
    name: string;
    email: string;
    phone?: Phone;
    organization?: string;
    jobTitle?: string;
    /** A predefined function, or "other" with the applicant's own description in `specified`. */
    primaryFunction?: { id: PrimaryFunction["id"]; label: string; specified?: string };
    website?: string;
  };
  location: Location;
  answers: { key: string; label: string; value: string }[];
};

const FORBIDDEN_LOCAL = /[\s@<>()[\]\\,;:"]/u;
const DOMAIN_LABEL = /^(?!-)[\p{L}\p{N}-]{1,63}(?<!-)$/u;

/**
 * Syntax check for a single address (international characters allowed). A well-formed
 * address proves nothing about who owns it; it is never treated as verified.
 */
export function emailError(value: string, label: string): string | undefined {
  const email = value.trim();
  if (!email) return `${label} is required.`;
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const labels = domain.split(".");
  const valid =
    email.length <= limits.email &&
    at > 0 &&
    local.length <= 64 &&
    !FORBIDDEN_LOCAL.test(local) &&
    !local.startsWith(".") && !local.endsWith(".") && !local.includes("..") &&
    labels.length >= 2 &&
    labels.every((part) => DOMAIN_LABEL.test(part)) &&
    /^(\p{L}{2,}|xn--[a-z\d-]+)$/iu.test(labels.at(-1)!);
  return valid ? undefined : "Enter a valid email address.";
}

/** Accepts "company.com" or a full http(s) URL; returns the normalised https URL or undefined. */
export function normaliseWebsite(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed) || trimmed.length > limits.website) return undefined;
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    if (url.username || url.password) return undefined;
    const labels = url.hostname.split(".");
    if (labels.length < 2 || labels.some((part) => !part) || !/^([a-z]{2,}|xn--[a-z\d-]+)$/i.test(labels.at(-1)!)) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

/**
 * Submission boundary check. Re-resolves every selection against the catalogue and the
 * geography dataset and applies the engagement's contact policy, so empty, stale or
 * manipulated values cannot reach the request. Every invalid field is reported, in form order.
 */
export function validateApplication(
  engagementValue: string,
  planId: string,
  identity: Identity,
  answers: Readonly<Record<string, string>>,
): { ok: true; application: Application } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const engagement = parseEngagement(engagementValue);
  if (!engagement) return { ok: false, errors: { engagement: "Select an access mode." } };
  const mode = modeOf(engagement);
  const plan = mode ? findPlan(mode, planId) : undefined;
  if (mode && !plan) errors.plan = "Select a plan.";
  const policy = contactPolicy(engagement);

  // Names: any script, spaces, hyphens and apostrophes; only emptiness and length are refused.
  const name = identity.name.trim().replace(/\s+/g, " ");
  if (!name || !/\p{L}/u.test(name)) errors.name = "Full name is required.";
  else if (name.length > limits.name) errors.name = `Use ${limits.name} characters or fewer.`;

  const email = identity.email.trim();
  const emailProblem = emailError(email, policy.emailLabel);
  if (emailProblem) errors.email = emailProblem;

  let phone: Phone | undefined;
  if (policy.phone === "required" || identity.phone.trim()) {
    const resolved = resolvePhone(identity.phoneCountry, identity.phone);
    if (resolved.ok) phone = resolved.phone;
    else errors[resolved.field] = resolved.message;
  }

  const text = (key: "organization" | "jobTitle", requirement: Requirement, label: string): string | undefined => {
    if (requirement === "omitted") return undefined;
    const value = identity[key].trim();
    if (!value) {
      if (requirement === "required") errors[key] = `${label} is required.`;
      return undefined;
    }
    if (value.length > limits[key]) errors[key] = `Use ${limits[key]} characters or fewer.`;
    return value;
  };
  const organization = text("organization", policy.organization, "Company / Organization");
  const jobTitle = text("jobTitle", policy.jobTitle, "Job title");

  let primaryFunction: Application["contact"]["primaryFunction"];
  if (policy.primaryFunction !== "omitted") {
    const chosen = primaryFunctions.find((f) => f.id === identity.primaryFunction);
    if (!chosen && (policy.primaryFunction === "required" || identity.primaryFunction)) errors.primaryFunction = "Select a primary function.";
    if (chosen?.id === OTHER_FUNCTION) {
      // "Other" is only complete with a description; whitespace or punctuation alone is refused.
      const specified = identity.primaryFunctionOther.trim().replace(/\s+/g, " ");
      if (!/[\p{L}\p{N}]/u.test(specified)) errors.primaryFunctionOther = "Specify your primary function.";
      else if (specified.length > limits.primaryFunctionOther) errors.primaryFunctionOther = `Use ${limits.primaryFunctionOther} characters or fewer.`;
      else primaryFunction = { id: chosen.id, label: chosen.label, specified };
    } else if (chosen) {
      primaryFunction = { id: chosen.id, label: chosen.label };
    }
  }

  let website: string | undefined;
  if (policy.website !== "omitted") {
    if (identity.website.trim()) {
      website = normaliseWebsite(identity.website);
      if (!website) errors.website = "Enter a valid website, for example company.com.";
    } else if (policy.website === "required") {
      errors.website = "Organization website is required.";
    }
  }

  const located = resolveLocation(identity.country, identity.region);
  if (!located.ok) errors[located.field] = located.field === "country" ? "Select a country." : "Select a state or region.";

  const cleanAnswers: Application["answers"] = [];
  for (const field of requestFields(engagement)) {
    const value = (answers[field.key] ?? "").trim();
    if (!value) {
      if (field.required) errors[field.key] = `${field.label} is required.`;
      continue;
    }
    if (value.length > fieldLimit(field)) errors[field.key] = `Use ${fieldLimit(field)} characters or fewer.`;
    cleanAnswers.push({ key: field.key, label: field.label, value });
  }

  if (Object.keys(errors).length > 0 || !located.ok) return { ok: false, errors };
  const tier = mode ? tiers.find((t) => t.id === mode)! : undefined;
  return {
    ok: true,
    application: {
      engagement,
      mode: tier && { id: tier.id, name: tier.name },
      plan: plan && { id: plan.id, name: plan.name },
      contact: { name, email, phone, organization, jobTitle, primaryFunction, website },
      location: located.location,
      answers: cleanAnswers,
    },
  };
}

/** Serialises only the validated application: readable labels with stable ids where they exist. */
export function prepareRequest(application: Application) {
  const { engagement, mode, plan, contact, location, answers } = application;
  const config = engagements[engagement];
  const policy = contactPolicy(engagement);
  const line = (label: string, value: string | undefined) => (value ? [`${label}: ${value}`] : []);
  const applicant = [
    ...line("Full name", contact.name),
    ...line(policy.emailLabel, contact.email),
    ...line("Phone", contact.phone && `${contact.phone.e164} (${contact.phone.international})`),
    ...line("Company / Organization", contact.organization),
    ...line("Job title", contact.jobTitle),
    ...line("Primary function", contact.primaryFunction && `${contact.primaryFunction.label} (${contact.primaryFunction.id})`),
    ...line("Primary function (specified)", contact.primaryFunction?.specified),
    ...line("Organization website", contact.website),
  ];
  const selections = [
    mode ? `Access mode: ${mode.name} (${mode.id})` : `Engagement: ${config.label}`,
    ...(plan ? [`Plan: ${plan.name} (${plan.id})`] : []),
    `Country: ${location.country.name} (${location.country.code})`,
    location.region.id === REGION_NOT_APPLICABLE
      ? `State / Province / Region: ${location.region.name}`
      : `State / Province / Region: ${location.region.name} (${location.region.id})`,
  ];
  const context = answers.map(({ label, value }) => `${label}:\n${value}`);
  return {
    subject: plan ? `${config.subject} — ${plan.name}` : config.subject,
    body: [applicant.join("\n"), selections.join("\n"), ...context].join("\n\n"),
  };
}

export function requestMailto(destination: string, request: ReturnType<typeof prepareRequest>) {
  return `mailto:${destination}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
}
