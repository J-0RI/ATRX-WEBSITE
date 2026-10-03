export type NavItem = {
  label: string;
  href: string;
  badge?: string;
  /** Extra search terms (e.g. pillar subtitles). */
  keywords?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/** Sidebar information architecture. Every href resolves to a real route or anchor. */
export const sidebar: NavSection[] = [
  {
    title: "Get Started",
    items: [
      { label: "Overview", href: "/" },
      { label: "Access Tiers", href: "/access", keywords: "Prosumer Node Capital Desk Institutional pricing" },
      { label: "Enterprise Tenancy", href: "/partnerships" },
      { label: "Documentation", href: "/documentation" },
      { label: "Contact Engineering", href: "/contact" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { label: "System Architecture", href: "/architecture", badge: "v4.0" },
      { label: "Perception", href: "/architecture#perception", keywords: "Data Ingestion" },
      { label: "Synthesis", href: "/architecture#synthesis", keywords: "Structural Topology" },
      { label: "Projection", href: "/architecture#projection", keywords: "Inference Routing" },
      { label: "Conditioning", href: "/architecture#conditioning", keywords: "State Gating regime" },
      { label: "Control", href: "/architecture#control", keywords: "Capital Protection veto" },
      { label: "Execution", href: "/architecture#execution", keywords: "Latency Terminal" },
      { label: "Adaptation", href: "/architecture#adaptation", keywords: "Telemetry Loop" },
      { label: "Inference Pipeline", href: "/architecture#pipeline" },
      { label: "Transport Layer", href: "/architecture#transport", keywords: "JSON payload webhook" },
    ],
  },
  {
    title: "Integration",
    items: [
      { label: "Native Risk Mandates", href: "/partnerships#risk-mandates", keywords: "guardrails drawdown exposure blackout" },
      { label: "Zero-Latency Webhooks", href: "/partnerships#webhooks" },
      { label: "Causal Attribution", href: "/partnerships#attribution" },
      { label: "Venue Independence", href: "/partnerships#venues" },
      { label: "Operational Sovereignty", href: "/partnerships#sovereignty" },
      { label: "Audit-Grade Ledgers", href: "/partnerships#ledgers" },
      { label: "Deployment Process", href: "/partnerships#deployment" },
    ],
  },
  {
    title: "Instruments",
    items: [
      { label: "Live Traded", href: "/instruments#live", keywords: "MET_SAFE FX_DM" },
      { label: "Preparing for v4.0", href: "/instruments#v4", keywords: "FX_DM_BASKET DLR_INDEX_VEC EQ_US_MEGA ENG_FUT_VEC" },
      { label: "Topological Roadmap", href: "/instruments#roadmap", keywords: "TECH_CAPX_NODES SOV_DUR_CURVES VOL_SRF_SURFACES" },
    ],
  },
  {
    title: "Research & Disclosure",
    items: [
      { label: "Structural Philosophy", href: "/philosophy" },
      { label: "Phase 1 Performance", href: "/performance" },
      { label: "Risk Disclosure", href: "/risk" },
      { label: "Founder", href: "/founder" },
    ],
  },
];

/** Centre group of the global navigation. */
export const primaryNav: NavItem[] = [
  { label: "Architecture", href: "/architecture" },
  { label: "Performance", href: "/performance" },
  { label: "Partnerships", href: "/partnerships" },
];

export const requestAccessMenu: NavItem[] = [
  { label: "Access tiers", href: "/access" },
  { label: "Documentation request", href: "/contact?engagement=documentation" },
  { label: "Contact engineering", href: "/contact" },
];

/** Flat index used by search. */
export const searchIndex = sidebar.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);

export const ENGINEERING_EMAIL = "timilehinolapade@atrx.tech";
export const LINKEDIN_URL = "https://www.linkedin.com/in/taolapade";
