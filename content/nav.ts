export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  /** Label used by global search when the sidebar label alone is ambiguous (e.g. "Overview"). */
  searchLabel?: string;
  /** Extra search terms (e.g. pillar subtitles). */
  keywords?: string;
};

export type NavGroup = {
  title?: string;
  items: NavItem[];
};

/**
 * Shared navigation shape. The product rail owns independent product routes;
 * global-domain topic records are retained below for global search only.
 */
export type LocalSection = {
  id: "product" | "documentation" | "architecture" | "partnerships";
  label: string;
  subtitle?: string;
  badge?: string;
  hideContext?: boolean;
  groups: NavGroup[];
};

/** The only primary product navigation. Global domains stay in the navbar. */
export const productSection: LocalSection = {
  id: "product",
  label: "Product",
  hideContext: true,
  groups: [
    { title: "Get Started", items: [
      { label: "Overview", href: "/overview", searchLabel: "ATRX product overview", keywords: "operating model intelligence controls delivery" },
      { label: "Quickstart", href: "/quickstart", keywords: "onboarding Python JavaScript payload integration" },
      { label: "Access Tiers", href: "/access", keywords: "Prosumer Node Capital Desk Institutional pricing comparison" },
    ] },
    { title: "Access Modes", items: [
      { label: "Prosumer Node", href: "/access/prosumer-node", keywords: "Tier I single tenant FX metals" },
      { label: "Capital Desk", href: "/access/capital-desk", keywords: "Tier II enterprise cohort SDK drawdown" },
      { label: "Institutional", href: "/access/institutional", keywords: "Tier III dedicated cluster AWS GCP governance" },
    ] },
    { title: "Intelligence", items: [
      { label: "Systemic Macro Intelligence", href: "/capabilities/market-intelligence", keywords: "causal transmission perception synthesis projection" },
      { label: "Regime & State Analysis", href: "/capabilities/regime-state-analysis", keywords: "conditioning classification state gating" },
      { label: "Causal Attribution", href: "/capabilities/causal-attribution", keywords: "P&L regime tags structural identifiers" },
      { label: "Market Coverage", href: "/capabilities/market-coverage", keywords: "instruments FX metals indices energy live preparing roadmap" },
    ] },
    { title: "Control & Delivery", items: [
      { label: "Risk & Control", href: "/capabilities/risk-control", keywords: "veto exposure capital sovereignty" },
      { label: "Native Risk Mandates", href: "/control/native-risk-mandates", keywords: "guardrails drawdown blackout limits" },
      { label: "Zero-Latency Webhooks", href: "/delivery/zero-latency-webhooks", keywords: "JSON signed schema replay delivery" },
      { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers", keywords: "telemetry governance decision logs veto events" },
    ] },
  ],
};

/** Detailed global-domain topics remain searchable, independently of the product rail. */
const domainSearchSections = {
  documentation: {
    id: "documentation",
    label: "Documentation",
    groups: [
      {
        items: [
          { label: "Overview", href: "/documentation", searchLabel: "Documentation overview" },
          { label: "Technical Library", href: "/documentation#library", keywords: "whitepapers reports disclosures" },
        ],
      },
      {
        title: "Research",
        items: [{ label: "Structural Philosophy", href: "/philosophy", keywords: "essay alpha decay causal mandate" }],
      },
      {
        title: "Instruments",
        items: [
          { label: "Overview", href: "/instruments", searchLabel: "Instruments overview" },
          { label: "Live Traded", href: "/instruments#live", keywords: "MET_SAFE FX_DM" },
          { label: "Preparing for v4.0", href: "/instruments#v4", keywords: "FX_DM_BASKET DLR_INDEX_VEC EQ_US_MEGA ENG_FUT_VEC" },
          { label: "Topological Roadmap", href: "/instruments#roadmap", keywords: "TECH_CAPX_NODES SOV_DUR_CURVES VOL_SRF_SURFACES" },
        ],
      },
    ],
  },
  architecture: {
    id: "architecture",
    label: "Architecture",
    badge: "v4.0",
    groups: [
      {
        items: [{ label: "Overview", href: "/architecture", searchLabel: "System architecture", keywords: "whitepaper v4.0" }],
      },
      {
        title: "Structural Pillars",
        items: [
          { label: "Perception", href: "/architecture#perception", keywords: "Data Ingestion" },
          { label: "Synthesis", href: "/architecture#synthesis", keywords: "Structural Topology" },
          { label: "Projection", href: "/architecture#projection", keywords: "Inference Routing" },
          { label: "Conditioning", href: "/architecture#conditioning", keywords: "State Gating regime" },
          { label: "Control", href: "/architecture#control", keywords: "Capital Protection veto" },
          { label: "Execution", href: "/architecture#execution", keywords: "Latency Terminal" },
          { label: "Adaptation", href: "/architecture#adaptation", keywords: "Telemetry Loop" },
        ],
      },
      {
        title: "System",
        items: [
          { label: "Inference Pipeline", href: "/architecture#pipeline" },
          { label: "Transport Layer", href: "/architecture#transport", keywords: "JSON payload webhook" },
          { label: "Engineering Footprint", href: "/architecture#footprint" },
        ],
      },
    ],
  },
  partnerships: {
    id: "partnerships",
    label: "Partnerships",
    subtitle: "Enterprise Tenancy",
    groups: [
      {
        items: [{ label: "Overview", href: "/partnerships", searchLabel: "Enterprise tenancy", keywords: "partnerships integration" }],
      },
      {
        title: "Distributed Integration",
        items: [
          { label: "Native Risk Mandates", href: "/partnerships#risk-mandates", keywords: "guardrails drawdown exposure blackout" },
          { label: "Zero-Latency Webhooks", href: "/partnerships#webhooks" },
          { label: "Causal Attribution", href: "/partnerships#attribution" },
          { label: "Venue Independence", href: "/partnerships#venues" },
          { label: "Operational Sovereignty", href: "/partnerships#sovereignty" },
          { label: "Audit-Grade Ledgers", href: "/partnerships#ledgers" },
        ],
      },
      {
        title: "Engagement",
        items: [
          { label: "Engagement Models", href: "/partnerships#engagement" },
          { label: "Deployment Process", href: "/partnerships#deployment" },
        ],
      },
    ],
  },
} satisfies Record<Exclude<LocalSection["id"], "product">, LocalSection>;

/** Focused single-purpose destinations: no local navigation, but globally searchable. */
const standalonePages: (NavItem & { section: string })[] = [
  { label: "Phase 1 Performance", href: "/performance", section: "Performance", keywords: "Q1 2026 validation sharpe metrics" },
  { label: "ATRX home", href: "/", section: "Home" },
  { label: "Request Access", href: "/contact", section: "Request access", keywords: "contact engineering apply application" },
  { label: "Risk Disclosure", href: "/risk", section: "Disclosure" },
];

/** Centre group of the global navigation. */
export const primaryNav: NavItem[] = [
  { label: "Architecture", href: "/architecture" },
  { label: "Performance", href: "/performance" },
  { label: "Partnerships", href: "/partnerships" },
];

export const documentationMenu: NavItem[] = [
  { label: "Overview", href: "/documentation" },
  { label: "Access tiers", href: "/access" },
  { label: "System architecture", href: "/architecture" },
  { label: "Enterprise tenancy", href: "/partnerships" },
  { label: "Instruments", href: "/instruments" },
  { label: "Technical library", href: "/documentation#library" },
];

export const requestAccessMenu: NavItem[] = [
  { label: "Access tiers", href: "/access" },
  { label: "Documentation request", href: "/contact?engagement=documentation#request" },
  { label: "Contact engineering", href: "/contact" },
];

// Deeper product guides replace their matching enterprise-anchor search results.
// Generic labels such as Overview must still retain each global domain's landing page.
const productTopicLabels = new Set(productSection.groups.slice(2).flatMap((group) => group.items.map((item) => item.label)));

/** Global search includes product guides, domain topics and standalone pages once each. */
export const searchIndex = [
  ...productSection.groups.flatMap((group) => group.items.map(({ searchLabel, ...item }) => ({ ...item, label: searchLabel ?? item.label, section: group.title ?? productSection.label }))),
  ...Object.values(domainSearchSections).flatMap((section: LocalSection) =>
    section.groups.flatMap((group) =>
      group.items.filter((item) => !productTopicLabels.has(item.label)).map(({ searchLabel, ...item }) => ({
        ...item,
        label: searchLabel ?? item.label,
        section: section.label,
      })),
    ),
  ),
  ...standalonePages,
];

/**
 * ATRX is a Haldane product: official contact is organisational, never an individual.
 * Verified against the approved Haldane site (support + policies pages).
 */
export const CONTACT_EMAIL = "contact@haldane.xyz";

/**
 * Haldane company layer. ATRX is a product of Haldane: support, policies and corporate
 * information live on haldane.xyz and are linked, never duplicated as ATRX routes.
 * Flip HALDANE_SITE_LIVE once haldane.xyz resolves; until then those links do not render.
 */
export const HALDANE_SITE_LIVE = false;

export const HALDANE_URLS = {
  home: "https://haldane.xyz",
  support: "https://haldane.xyz/support",
  privacy: "https://haldane.xyz/policies#privacy",
  terms: "https://haldane.xyz/policies#terms",
} as const;

export type FooterLink = {
  label: string;
  href: string;
  /** Leaves the ATRX site (Haldane destinations, mail). */
  external?: boolean;
  /** Rendered only when HALDANE_SITE_LIVE is true. */
  requiresHaldane?: boolean;
};

export type FooterGroup = { title: string; links: FooterLink[] };

/** One footer column: a lead group plus sub-groups, read as a categorised directory. */
export type FooterColumn = {
  id: "product" | "architecture" | "documentation" | "enterprise";
  groups: FooterGroup[];
};

/**
 * Exactly four navigation columns beside the brand rail. Haldane company/disclosure
 * links form the final group within Enterprise, never a fifth column. Every href is
 * a real route or an existing anchor; Haldane-owned destinations remain launch-gated.
 */
const footerTaxonomy: FooterColumn[] = [
  {
    id: "product",
    groups: [
      {
        title: "Product",
        links: [
          { label: "Overview", href: "/" },
          { label: "Access", href: "/access" },
          { label: "Performance", href: "/performance" },
          { label: "Request access", href: "/contact" },
        ],
      },
      {
        title: "Access tiers",
        links: [
          { label: "Prosumer Node", href: "/access#prosumer-node" },
          { label: "Capital Desk", href: "/access#capital-desk" },
          { label: "Institutional", href: "/access#institutional" },
        ],
      },
      {
        title: "Phase 1 validation",
        links: [
          { label: "Performance metrics", href: "/performance" },
          { label: "Validated paths", href: "/performance#paths" },
          { label: "Verification & risk", href: "/performance#verification" },
        ],
      },
    ],
  },
  {
    id: "architecture",
    groups: [
      { title: "Architecture", links: [{ label: "Architecture overview", href: "/architecture" }] },
      {
        title: "Structural pillars",
        links: [
          { label: "Perception", href: "/architecture#perception" },
          { label: "Synthesis", href: "/architecture#synthesis" },
          { label: "Projection", href: "/architecture#projection" },
          { label: "Conditioning", href: "/architecture#conditioning" },
          { label: "Control", href: "/architecture#control" },
          { label: "Execution", href: "/architecture#execution" },
          { label: "Adaptation", href: "/architecture#adaptation" },
        ],
      },
      {
        title: "System",
        links: [
          { label: "Inference Pipeline", href: "/architecture#pipeline" },
          { label: "Transport Layer", href: "/architecture#transport" },
          { label: "Engineering Footprint", href: "/architecture#footprint" },
        ],
      },
    ],
  },
  {
    id: "documentation",
    groups: [
      {
        title: "Documentation",
        links: [
          { label: "Documentation", href: "/documentation" },
          { label: "Technical Library", href: "/documentation#library" },
          { label: "Documentation request", href: "/contact?engagement=documentation#request" },
        ],
      },
      { title: "Research", links: [{ label: "Structural Philosophy", href: "/philosophy" }] },
      {
        title: "Instruments",
        links: [
          { label: "Instruments overview", href: "/instruments" },
          { label: "Live traded", href: "/instruments#live" },
          { label: "Preparing for v4.0", href: "/instruments#v4" },
          { label: "Topological roadmap", href: "/instruments#roadmap" },
        ],
      },
    ],
  },
  {
    id: "enterprise",
    groups: [
      { title: "Enterprise", links: [{ label: "Enterprise Tenancy", href: "/partnerships" }] },
      {
        title: "Integration",
        links: [
          { label: "Native Risk Mandates", href: "/partnerships#risk-mandates" },
          { label: "Zero-Latency Webhooks", href: "/partnerships#webhooks" },
          { label: "Causal Attribution", href: "/partnerships#attribution" },
          { label: "Venue Independence", href: "/partnerships#venues" },
          { label: "Operational Sovereignty", href: "/partnerships#sovereignty" },
          { label: "Audit-Grade Ledgers", href: "/partnerships#ledgers" },
        ],
      },
      {
        title: "Engagement",
        links: [
          { label: "Engagement Models", href: "/partnerships#engagement" },
          { label: "Deployment Process", href: "/partnerships#deployment" },
        ],
      },
      {
        title: "Company & disclosures",
        links: [
          { label: "Haldane", href: HALDANE_URLS.home, external: true, requiresHaldane: true },
          { label: "Support", href: HALDANE_URLS.support, external: true, requiresHaldane: true },
          { label: "Contact Haldane", href: `mailto:${CONTACT_EMAIL}`, external: true },
          { label: "Risk Disclosure", href: "/risk" },
          { label: "Privacy", href: HALDANE_URLS.privacy, external: true, requiresHaldane: true },
          { label: "Terms", href: HALDANE_URLS.terms, external: true, requiresHaldane: true },
        ],
      },
    ],
  },
];

/** Footer columns as rendered now: Haldane destinations (and emptied groups) omitted until live. */
export const footerColumns: FooterColumn[] = footerTaxonomy.map((column) => ({
  ...column,
  groups: column.groups
    .map((group) => ({ ...group, links: group.links.filter((l) => HALDANE_SITE_LIVE || !l.requiresHaldane) }))
    .filter((group) => group.links.length > 0),
}));
