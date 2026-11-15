/** Canonical request content, grounded in content/tiers.ts and the technical library. */
import { accessPlans, findPlan, tiers, type AccessPlan, type ModeId, type Tier } from "@/content/tiers";
import { classifyEmail, normaliseEmail } from "@/lib/email-domains";
import { REGION_NOT_APPLICABLE, resolveLocation, type Location } from "@/lib/geography";
import { resolvePhone, type Phone } from "@/lib/phone";

type FieldOption = { value: string; label: string };
export type RequestField = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select";
  required?: boolean;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  /** Select fields only: the accepted answers, serialised by label. */
  options?: readonly FieldOption[];
  /**
   * Conditional question: rendered, validated and submitted only while another answer in the
   * same engagement (or the selected plan, key "plan") is one of the listed values.
   */
  when?: { key: string; in: readonly string[] };
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
/* ---------- Mode-aware qualification questions ----------
 * Each question maps to a capability in the /explore comparison (content/tiers.ts) and is asked
 * only of the modes that include it: seats, spending limits, SSO/SCIM and tailored contracts for
 * Capital Desk and Institutional; network, residency, retention, SLA and HIPAA for Institutional.
 * No question asks for strategies, positions, holdings, AUM or credentials.
 */
const opt = (value: string, label: string): FieldOption => ({ value, label });
const NOT_DETERMINED = opt("undetermined", "Not yet determined");

const seatBands = [opt("1-5", "1–5"), opt("6-15", "6–15"), opt("16-50", "16–50"), opt("51-100", "51–100"), opt("100+", "More than 100")];
const seats: RequestField = {
  key: "seats", label: "How many seats does your team need?", kind: "select", required: true, options: seatBands,
  hint: "Initial named users, including researchers, traders, risk officers and administrators.",
};
const projectedSeats: RequestField = {
  key: "projectedSeats", label: "Projected seats within 12 months", kind: "select",
  options: [opt("no-change", "No change expected"), ...seatBands, NOT_DETERMINED],
};
const regulated: RequestField = {
  key: "regulated", label: "Is your organization regulated by a financial authority?", kind: "select",
  options: [opt("yes", "Yes"), opt("no", "No"), opt("discuss", "Prefer to discuss")],
};
const regulators: RequestField = {
  key: "regulators", label: "Primary regulator(s)", kind: "text", when: { key: "regulated", in: ["yes"] },
  placeholder: "e.g. SEC, FCA, MAS",
  hint: "Informs recordkeeping, retention and review requirements.",
};
const usageVolume: RequestField = {
  key: "usageVolume", label: "Expected usage volume", kind: "text",
  placeholder: "e.g. 6 strategies, 40 instruments, 20,000 API requests per day",
  hint: "An approximate figure is enough to scope capacity.",
};
const identityOptions = [
  opt("none", "Not required at this stage"),
  opt("sso", "Single sign-on (SAML or OIDC)"),
  opt("sso-scim", "Single sign-on with SCIM provisioning"),
  NOT_DETERMINED,
];
const identityProvider: RequestField = {
  key: "identityProvider", label: "Identity provider", kind: "text", when: { key: "identity", in: ["sso", "sso-scim"] },
  placeholder: "e.g. Okta, Microsoft Entra ID, Ping Identity",
};
const spendControls: RequestField = {
  key: "spendControls", label: "Will administrators need to set spending or usage limits?", kind: "select",
  options: [
    opt("organization", "Organization-wide limits only"),
    opt("team", "Limits per team or desk"),
    opt("user", "Limits per user, team and organization"),
    opt("none", "Not required"),
    NOT_DETERMINED,
  ],
};
const contractDetails: RequestField = {
  key: "contractDetails", label: "Contract requirements", kind: "textarea", when: { key: "contract", in: ["tailored", "own-paper"] },
  hint: "Describe any usage commitments, product bundling, billing arrangements and preferred contract duration.",
};
const procurement: RequestField = {
  key: "procurement", label: "What review will your organization require before contracting?", kind: "select",
  options: [
    opt("none", "No formal review"),
    opt("security", "Security review"),
    opt("security-legal", "Security and legal review"),
    opt("due-diligence", "Vendor due diligence with procurement approval"),
    NOT_DETERMINED,
  ],
};
const evaluation: RequestField = {
  key: "evaluation", label: "Evaluation approach", kind: "select",
  options: [
    opt("sandbox", "Integration sandbox"),
    opt("parallel-run", "Pilot with a paper-trading parallel run"),
    opt("direct", "Proceed directly to deployment"),
    NOT_DETERMINED,
  ],
};
const timeline: RequestField = {
  key: "timeline", label: "Intended adoption timeline", kind: "select",
  options: [opt("1m", "Within 1 month"), opt("1-3m", "1–3 months"), opt("3-6m", "3–6 months"), opt("6m+", "More than 6 months"), opt("exploratory", "Exploratory, no fixed date")],
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
      { key: "applicant", label: "Are you applying as an individual or for an organization?", kind: "select", required: true,
        options: [opt("individual", "Individual professional"), opt("organization", "On behalf of an organization")] },
      { ...seats, when: { key: "applicant", in: ["organization"] },
        hint: "Prosumer Node is licensed to a single operator. Teams that need several seats, central administration or single sign-on are usually better served by Capital Desk." },
      intendedUse,
      { key: "markets", label: "Markets / instruments of interest", kind: "text", placeholder: "e.g. EUR/USD, XAU/USD", hint: "Prosumer Node covers the core FX and Metals vectors. Describe your interests; this does not confirm instrument availability." },
      { key: "environment", label: "Current execution or research environment", kind: "text", placeholder: "e.g. Python research stack, broker API" },
      { key: "endpoint", label: "Receiving endpoint and integration method", kind: "text", when: { key: "plan", in: ["api-access", "execution-access"] },
        placeholder: "e.g. HTTPS webhook receiver, REST client, broker API" },
      timeline,
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
      { key: "orgType", label: "Organization type", kind: "select", required: true,
        options: [
          opt("hedge-fund", "Hedge fund"),
          opt("asset-manager", "Asset manager"),
          opt("proprietary-trading", "Proprietary trading firm"),
          opt("bank-broker-dealer", "Bank or broker-dealer"),
          opt("family-office", "Family office"),
          opt("corporate-treasury", "Corporate treasury"),
          opt("other", "Other"),
        ] },
      regulated,
      regulators,
      seats,
      projectedSeats,
      intendedUse,
      { key: "desk", label: "Desk / team context", kind: "text", placeholder: "e.g. Macro desk, four portfolio managers" },
      { key: "markets", label: "Primary markets / instruments", kind: "text", placeholder: "e.g. G10 FX, gold, equity indices", hint: "Describe the markets relevant to your desk, including any interest in the expanded Indices and Energy topology." },
      { key: "environment", label: "Existing risk / execution environment", kind: "textarea" },
      { key: "integration", label: "Primary integration path", kind: "select",
        options: [
          opt("rest-webhooks", "REST API and webhooks"),
          opt("streaming-sdk", "Streaming API and low-latency SDKs"),
          opt("fix", "FIX protocol"),
          opt("oms-ems", "OMS / EMS connectivity"),
          NOT_DETERMINED,
        ] },
      usageVolume,
      { key: "identity", label: "Identity and access requirements", kind: "select", options: identityOptions },
      identityProvider,
      spendControls,
      { key: "security", label: "Security and governance requirements", kind: "textarea",
        hint: "For example: role-based permissions, audit logs, IP allowlisting or network restrictions, data retention, SIEM or Compliance API access." },
      { key: "contract", label: "Does your team need a tailored contract?", kind: "select",
        options: [
          opt("standard", "Standard Capital Desk terms"),
          opt("tailored", "Tailored contract (usage commitments, product bundling)"),
          NOT_DETERMINED,
        ] },
      contractDetails,
      procurement,
      evaluation,
      timeline,
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
      { key: "orgType", label: "Organization type", kind: "select", required: true,
        options: [
          opt("bank-broker-dealer", "Bank or broker-dealer"),
          opt("asset-manager", "Asset manager"),
          opt("hedge-fund", "Hedge fund"),
          opt("pension-endowment", "Pension fund or endowment"),
          opt("sovereign-central-bank", "Sovereign wealth fund or central bank"),
          opt("insurer", "Insurer"),
          opt("healthcare-affiliated", "Healthcare-affiliated organization"),
          opt("other", "Other"),
        ] },
      regulated,
      regulators,
      seats,
      projectedSeats,
      intendedUse,
      { key: "scope", label: "Deployment scope", kind: "text", required: true, placeholder: "e.g. Two regional trading desks" },
      { key: "entities", label: "Participating business units or legal entities", kind: "textarea", required: true,
        when: { key: "plan", in: ["multi-entity-deployment"] },
        hint: "List each unit or entity and where it operates. This determines tenant permissions, information barriers and data residency." },
      { key: "infrastructure", label: "Infrastructure / environment context", kind: "text", placeholder: "e.g. AWS, on-premises data centre", hint: "Describe your current environment and any relevant AWS or GCP context." },
      { key: "integration", label: "Integration requirements", kind: "textarea" },
      usageVolume,
      { key: "identity", label: "Identity and access requirements", kind: "select", required: true, options: identityOptions },
      identityProvider,
      spendControls,
      { key: "network", label: "Network access requirements", kind: "select",
        options: [
          opt("ip-allowlisting", "Public endpoints restricted by IP allowlisting"),
          opt("private-connectivity", "Private connectivity (PrivateLink, Private Service Connect or VPC peering)"),
          NOT_DETERMINED,
        ] },
      { key: "residency", label: "Data residency requirements", kind: "select",
        options: [opt("none", "No specific requirement"), opt("regional", "Data must remain in specific regions"), NOT_DETERMINED] },
      { key: "regions", label: "Required regions or jurisdictions", kind: "text", required: true, when: { key: "residency", in: ["regional"] },
        placeholder: "e.g. European Union, United Kingdom" },
      { key: "retention", label: "Data retention requirements", kind: "select",
        options: [
          opt("standard", "Standard retention"),
          opt("custom", "Custom retention and deletion periods"),
          opt("custom-legal-hold", "Custom retention with legal hold"),
          NOT_DETERMINED,
        ] },
      { key: "phi", label: "Will your use of ATRX involve protected health information?", kind: "select",
        when: { key: "orgType", in: ["insurer", "healthcare-affiliated"] },
        options: [opt("no", "No"), opt("yes", "Yes, a HIPAA-ready offering would be required"), NOT_DETERMINED],
        hint: "The HIPAA-ready offering is planned and not yet available." },
      { key: "governance", label: "Governance / risk requirements", kind: "textarea",
        hint: "For example: role and group permissions, information barriers, research access restrictions, model change approvals." },
      { key: "telemetry", label: "Audit / telemetry requirements", kind: "textarea",
        hint: "For example: audit log export, Compliance API access, SIEM integration, recordkeeping obligations." },
      { key: "contract", label: "Commercial arrangement", kind: "select",
        options: [
          opt("tailored", "Tailored contract (usage commitments, product bundling)"),
          opt("own-paper", "Enterprise agreement on our own paper"),
          NOT_DETERMINED,
        ] },
      contractDetails,
      { key: "sla", label: "Service-level expectations", kind: "select",
        options: [opt("standard", "Standard operational commitments"), opt("contractual", "Contractual SLA with security incident notification terms"), NOT_DETERMINED] },
      procurement,
      evaluation,
      timeline,
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
export const limits = { name: 120, primaryFunctionOther: 120, email: 254, organization: 160, jobTitle: 120, website: 200, text: 200, textarea: 2000, select: 80 } as const;
export type EngagementAnswers = {
  [K in Engagement]: Record<(typeof engagements)[K]["fields"][number]["key"], string>;
};
export const engagementOptions = Object.keys(engagements) as Engagement[];
export const requestFields = (engagement: Engagement): readonly RequestField[] => engagements[engagement].fields;
export const contactPolicy = (engagement: Engagement): ContactPolicy => (engagements[engagement] as EngagementConfig).contact;
export const fieldLimit = (field: RequestField) => field.maxLength ?? limits[field.kind];

/** Questions that apply given the current answers and plan; hidden ones are never validated or sent. */
export function visibleFields(engagement: Engagement, answers: Readonly<Record<string, string>>, plan: string): readonly RequestField[] {
  const values: Readonly<Record<string, string>> = { ...answers, plan };
  return requestFields(engagement).filter((field) => !field.when || field.when.in.includes(values[field.when.key] ?? ""));
}

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

export const PERSONAL_EMAIL_ERROR = "Please use your business email address. Personal email addresses are not accepted.";
export const DISPOSABLE_EMAIL_ERROR = "Temporary or disposable email addresses are not accepted.";

/**
 * Syntax check for a single address (international characters allowed), then the provider
 * registry (lib/email-domains): disposable services are refused on every application email
 * field, consumer providers only where the field asks for a business email. Unfamiliar domains
 * pass. A well-formed address proves nothing about who owns it; it is never treated as verified.
 */
export function emailError(value: string, label: string, business = label === "Business email"): string | undefined {
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
  if (!valid || !normaliseEmail(email)) return "Enter a valid email address.";
  const provider = classifyEmail(email);
  if (provider === "disposable") return DISPOSABLE_EMAIL_ERROR;
  if (business && provider === "personal") return PERSONAL_EMAIL_ERROR;
  return undefined;
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

  const emailProblem = emailError(identity.email, policy.emailLabel);
  if (emailProblem) errors.email = emailProblem;
  const email = normaliseEmail(identity.email) ?? identity.email.trim();

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
  for (const field of visibleFields(engagement, answers, plan?.id ?? "")) {
    const value = (answers[field.key] ?? "").trim();
    if (!value) {
      if (field.required) errors[field.key] = field.kind === "select" ? "Select an option." : `${field.label} is required.`;
      continue;
    }
    if (field.options) {
      // Selects re-resolve against their options, so stale or manipulated values never reach the request.
      const chosen = field.options.find((option) => option.value === value);
      if (chosen) cleanAnswers.push({ key: field.key, label: field.label, value: chosen.label });
      else errors[field.key] = "Select an option.";
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
