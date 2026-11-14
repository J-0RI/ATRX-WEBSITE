/* Access families, sourced from atrx.tech/access. No prices are published: access is by application. */

export type Tier = {
  id: ModeId;
  name: string;
  tier: string;
  description: string;
  /** Who the mode is for, restated from its deployment guide. */
  audience: string;
  /** The three defining capabilities shown on the /explore card, restated from `features`. */
  highlights: [string, string, string];
  specs: { label: string; value: string }[];
  commercial: string;
  features: string[];
  apply: string;
};

export const tiers: Tier[] = [
  {
    id: "prosumer-node",
    name: "Prosumer Node",
    tier: "Tier I",
    audience: "A qualified quantitative prosumer running ATRX inside a single execution environment.",
    highlights: ["Single-tenant execution pipeline", "Core FX and Metals vectors", "Standard JSON webhook delivery"],
    description:
      "Single-tenant execution pipeline with systemic guardrails enforced at the API level.",
    specs: [
      { label: "Pipeline", value: "Single-tenant" },
      { label: "Instruments", value: "FX & Metals vectors" },
      { label: "Delivery", value: "Standard JSON webhook" },
    ],
    commercial: "Monthly compute fee",
    features: [
      "Single-tenant execution pipeline",
      "Access to the core FX and Metals topological vectors",
      "Systemic guardrails enforced at the API level",
      "Standard JSON webhook delivery",
    ],
    apply: "/contact?engagement=tier-1#request",
  },
  {
    id: "capital-desk",
    name: "Capital Desk",
    tier: "Tier II · Enterprise",
    audience: "Enterprise desks allocating across cohorts through their existing execution infrastructure.",
    highlights: ["Expanded topology, including Indices and Energy", "Direct low-latency integration SDKs", "Priority latency routing"],
    description:
      "Multi-node deployment for cohort allocation, with custom regime-gating and drawdown parameterization.",
    specs: [
      { label: "Instruments", value: "+ Indices, Energy" },
      { label: "Integration", value: "Low-latency SDKs" },
      { label: "Routing", value: "Priority latency" },
    ],
    commercial: "Base + Capacity",
    features: [
      "Multi-node deployment for cohort allocation",
      "Expanded instrument topology (Indices, Energy)",
      "Custom regime-gating and drawdown parameterization",
      "Direct low-latency integration SDKs",
      "Priority latency routing",
    ],
    apply: "/contact?engagement=tier-2#request",
  },
  {
    id: "institutional",
    name: "Institutional",
    tier: "Tier III",
    audience: "Institutions that need dedicated infrastructure, research access and governance telemetry.",
    highlights: ["Dedicated inference cluster on AWS or GCP", "Whitepapers and ablation studies", "Audit-grade telemetry logs"],
    description:
      "Dedicated inference cluster with bespoke structural topology modeling and direct engineering syncs.",
    specs: [
      { label: "Cluster", value: "Dedicated · AWS / GCP" },
      { label: "Research", value: "Whitepapers & ablations" },
      { label: "Telemetry", value: "Audit-grade logs" },
    ],
    commercial: "Negotiated terms",
    features: [
      "Dedicated inference cluster (AWS/GCP)",
      "Bespoke structural topology modeling",
      "Full access to whitepapers and ablation studies",
      "Audit-grade telemetry logs for governance",
      "Direct engineering syncs",
    ],
    apply: "/contact?engagement=tier-3#request",
  },
];

/* ---------- Plan families (/explore first section) ----------
 * Each access mode offers a small family of plans (decision-20261114-access-plan-families).
 * Plan names and positioning are proposed product tiers; plan-level allocations are
 * PROVISIONAL. They are deliberately separate from the mode-level comparison matrix below:
 * a capability included in a mode is not automatically included in every plan of that mode.
 * Every capability named here is one the matrix marks as included and available for the
 * parent mode, or one already published in that mode's `features`. No prices, latency,
 * capacity or certification commitments are implied. Apply reuses the mode's request route
 * because the application form does not yet accept a plan field.
 */
export type PlanId =
  | "standard"
  | "api-access"
  | "execution-access"
  | "single-desk"
  | "multi-desk"
  | "custom-routing"
  | "dedicated-deployment"
  | "multi-entity-deployment";

export type AccessPlan = {
  id: PlanId;
  mode: ModeId;
  /** Descriptive licence / deployment name (decision-20261114-plan-naming). */
  name: string;
  /** One concise card description (20–35 words). */
  summary: string;
  /**
   * Proposed access qualification. Not rendered on the plan cards; retained for the
   * application and onboarding flow.
   */
  requirement: string;
  capabilities: [string, string, string];
  allocation: "provisional";
};

export const accessPlans: Record<ModeId, AccessPlan[]> = {
  "prosumer-node": [
    {
      id: "standard",
      mode: "prosumer-node",
      name: "Standard",
      summary: "For independent quantitative researchers assessing market regimes and causal drivers on the ATRX platform, without signal delivery or execution routing.",
      requirement: "Research use, without execution routing",
      capabilities: [
        "Market regime analysis",
        "Causal factor attribution",
        "Historical research export",
      ],
      allocation: "provisional",
    },
    {
      id: "api-access",
      mode: "prosumer-node",
      name: "API Access",
      summary: "Structured market intelligence for independent systematic strategies, delivered by API and webhook into the trader’s existing research and execution workflow.",
      requirement: "Requires a defined strategy and a receiving endpoint",
      capabilities: [
        "REST API and webhook delivery",
        "Signal confidence scoring",
        "Structural break detection",
      ],
      allocation: "provisional",
    },
    {
      id: "execution-access",
      mode: "prosumer-node",
      name: "Execution Access",
      summary: "For independent systematic traders integrating ATRX directives with their own execution infrastructure, with pre-trade controls applied before any order is routed.",
      requirement: "Requires integration sandbox review before live routing",
      capabilities: [
        "Single-tenant execution pipeline",
        "Pre-trade risk checks",
        "Emergency execution halt",
      ],
      allocation: "provisional",
    },
  ],
  "capital-desk": [
    {
      id: "single-desk",
      mode: "capital-desk",
      name: "Single Desk",
      summary: "For a professional trading desk adding systemic macro intelligence and real-time portfolio exposure to its established research, risk and execution processes.",
      requirement: "Requires a named desk owner and an existing risk environment",
      capabilities: [
        "Cross-asset transmission analysis",
        "Real-time portfolio exposure",
        "Streaming API and low-latency SDKs",
      ],
      allocation: "provisional",
    },
    {
      id: "multi-desk",
      mode: "capital-desk",
      name: "Multi-Desk",
      summary: "For firms allocating across several desks or strategy cohorts that require coordinated allocation, consolidated performance oversight and a common audit record.",
      requirement: "Requires defined cohort and allocation mandates",
      capabilities: [
        "Multi-node allocation",
        "Model performance monitoring",
        "Immutable audit records",
      ],
      allocation: "provisional",
    },
    {
      id: "custom-routing",
      mode: "capital-desk",
      name: "Custom Routing",
      summary: "For professional desks with latency-sensitive execution that requires routing configured to their own venues, latency requirements and available compute capacity.",
      requirement: "Subject to available compute capacity",
      capabilities: [
        "Custom execution routing",
        "Latency telemetry",
        "Horizontal scaling",
      ],
      allocation: "provisional",
    },
  ],
  institutional: [
    {
      id: "dedicated-deployment",
      mode: "institutional",
      name: "Dedicated Deployment",
      summary: "For an institution requiring ATRX within its own dedicated infrastructure boundary, with access to research material and direct engineering syncs.",
      requirement: "Requires institutional onboarding and an infrastructure review",
      capabilities: [
        "Dedicated inference clusters",
        "Research ablation studies",
        "Technical implementation support",
      ],
      allocation: "provisional",
    },
    {
      id: "multi-entity-deployment",
      mode: "institutional",
      name: "Multi-Entity Deployment",
      summary: "For institutions coordinating one ATRX deployment across multiple business units or legal entities, with separate permissions and consolidated governance oversight.",
      requirement: "Requires a governance owner across participating units",
      capabilities: [
        "Tenant-level permissions",
        "Audit-grade telemetry logs",
        "Historical decision reconstruction",
      ],
      allocation: "provisional",
    },
  ],
};

/* ---------- Access-mode comparison (/explore) ----------
 * Institutional capability matrix across the eight core evaluation domains.
 * Entitlement indicators (included / unavailable / optional) are stored separately from
 * capability delivery status (available / in-development / planned / qualification) so
 * prospective tenants can distinguish access-mode scope from live operational readiness.
 */

export type ModeId = "prosumer-node" | "capital-desk" | "institutional";

export type ComparisonCell =
  | { kind: "included" }
  | { kind: "unavailable" }
  /** Can be included depending on the plan within the mode (user, 2026-11-14). */
  | { kind: "optional" };

export type DeliveryStatus =
  | "available"
  | "in-development"
  | "planned"
  | "qualification";

export type ComparisonCategoryId =
  | "market-intelligence"
  | "market-coverage"
  | "portfolio-risk"
  | "execution-integration"
  | "model-governance"
  | "enterprise-security"
  | "infrastructure-reliability"
  | "institutional-workflows";

export type ComparisonRow = {
  id: string;
  category: ComparisonCategoryId;
  label: string;
  description: string;
  tooltip?: boolean;
  keywords: string[];
  values: Record<ModeId, ComparisonCell>;
  status: DeliveryStatus;
  source: string;
};

export type ComparisonGroup = {
  id: ComparisonCategoryId;
  title: string;
  rows: ComparisonRow[];
};

const yes: ComparisonCell = { kind: "included" };
const no: ComparisonCell = { kind: "unavailable" };
const optional: ComparisonCell = { kind: "optional" };

type RowMeta = {
  id: string;
  category: ComparisonCategoryId;
  status: DeliveryStatus;
  description: string;
  tooltip?: boolean;
  keywords: string[];
  source: string;
};

const row = (
  label: string,
  prosumer: ComparisonCell,
  desk: ComparisonCell,
  institutional: ComparisonCell,
  meta: RowMeta,
): ComparisonRow => ({
  id: meta.id,
  category: meta.category,
  label,
  description: meta.description,
  tooltip: meta.tooltip ?? false,
  keywords: meta.keywords,
  values: { "prosumer-node": prosumer, "capital-desk": desk, institutional },
  status: meta.status,
  source: meta.source,
});

export const accessComparison: ComparisonGroup[] = [
  {
    id: "market-intelligence",
    title: "Market Intelligence & Research",
    rows: [
      row("Systemic macro intelligence", yes, yes, yes, {
        id: "systemic-macro-intelligence",
        category: "market-intelligence",
        status: "available",
        tooltip: true,
        description:
          "Combines macroeconomic, funding, and cross-market liquidity signals to assess prevailing market conditions.",
        keywords: ["macro", "systemic", "intelligence", "policy", "liquidity", "central bank", "rates"],
        source: "/capabilities/market-intelligence",
      }),
      row("Market regime classification", yes, yes, yes, {
        id: "market-regime-classification",
        category: "market-intelligence",
        status: "available",
        description:
          "Classifies active volatility, liquidity, and correlation states in real time across monitored markets.",
        keywords: ["regime", "state", "classification", "volatility", "clustering", "market state"],
        source: "/capabilities/regime-state-analysis",
      }),
      row("Regime transition probabilities", yes, yes, yes, {
        id: "regime-transition-probabilities",
        category: "market-intelligence",
        status: "available",
        tooltip: true,
        description:
          "Estimates the likelihood of markets transitioning between identified structural regimes.",
        keywords: ["regime", "transition", "probability", "markov", "state shift", "gating"],
        source: "/capabilities/regime-state-analysis",
      }),
      row("Cross-asset transmission analysis", no, yes, yes, {
        id: "cross-asset-transmission-analysis",
        category: "market-intelligence",
        status: "available",
        description:
          "Traces how monetary policy, sovereign yield repricing, and liquidity shocks propagate across asset classes.",
        keywords: ["cross-asset", "transmission", "spillover", "propagation", "correlation", "channels"],
        source: "/capabilities/market-intelligence",
      }),
      row("Causal factor attribution", yes, yes, yes, {
        id: "causal-factor-attribution",
        category: "market-intelligence",
        status: "available",
        tooltip: true,
        description:
          "Attributes each directive and realized P&L outcome to its primary macroeconomic catalyst and structural driver.",
        keywords: ["causal", "factor", "attribution", "pnl", "p&l", "catalyst", "driver"],
        source: "/capabilities/causal-attribution",
      }),
      row("Structural break detection", yes, yes, yes, {
        id: "structural-break-detection",
        category: "market-intelligence",
        status: "available",
        tooltip: true,
        description:
          "Separates persistent structural regime breaks from transient market noise and positioning squeezes.",
        keywords: ["structural break", "changepoint", "dislocation", "repricing", "signal isolation"],
        source: "/capabilities/regime-state-analysis",
      }),
      row("Macro event impact analysis", yes, yes, yes, {
        id: "macro-event-impact-analysis",
        category: "market-intelligence",
        status: "available",
        description:
          "Evaluates scheduled central-bank decisions, inflation prints, and sovereign auctions alongside automated macroeconomic blackout windows.",
        keywords: ["macro event", "calendar", "blackout", "cpi", "fomc", "nfp", "central bank", "catalyst"],
        source: "/control/native-risk-mandates",
      }),
      row("Signal confidence scoring", yes, yes, yes, {
        id: "signal-confidence-scoring",
        category: "market-intelligence",
        status: "available",
        description:
          "Quantifies model conviction and structural alignment on every directive payload for downstream sizing and mandate filtering.",
        keywords: ["signal", "confidence", "conviction", "score", "probability", "strength"],
        source: "/capabilities/market-intelligence",
      }),
      row("Forecast uncertainty estimates", no, yes, yes, {
        id: "forecast-uncertainty-estimates",
        category: "market-intelligence",
        status: "in-development",
        tooltip: true,
        description:
          "Provides regime-conditional dispersion and uncertainty bounds alongside directional outputs for desk-level risk scaling.",
        keywords: ["forecast", "uncertainty", "dispersion", "confidence interval", "variance", "error bounds"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Historical regime replay", no, yes, yes, {
        id: "historical-regime-replay",
        category: "market-intelligence",
        status: "planned",
        description:
          "Point-in-time inspection of historical regime classifications, transition probabilities, and catalyst tags across past market cycles.",
        keywords: ["historical", "regime", "replay", "backtest", "archive", "cycle", "point-in-time"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Scenario-based research", no, yes, yes, {
        id: "scenario-based-research",
        category: "market-intelligence",
        status: "planned",
        description:
          "Interactive evaluation of counterfactual policy, rate, and commodity shocks against active structural theses and transmission paths.",
        keywords: ["scenario", "counterfactual", "research", "what-if", "macro shock", "simulation"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Research signal provenance", yes, yes, yes, {
        id: "research-signal-provenance",
        category: "market-intelligence",
        status: "available",
        tooltip: true,
        description:
          "Records the data sources, model versions, and analytical steps behind a research output.",
        keywords: ["provenance", "lineage", "signal", "research", "evidence", "audit", "traceability"],
        source: "/capabilities/causal-attribution",
      }),
    ],
  },
  {
    id: "market-coverage",
    title: "Market Coverage & Data",
    rows: [
      row("Spot FX coverage", yes, yes, yes, {
        id: "spot-fx-coverage",
        category: "market-coverage",
        status: "available",
        description:
          "Core developed-market currency topology (FX_DM) validated during Phase 1 live execution, with broader G10 basket nodes preparing for v4.0.",
        keywords: ["fx", "spot fx", "foreign exchange", "currencies", "g10", "fx_dm", "dollar"],
        source: "/capabilities/market-coverage",
      }),
      row("Metals coverage", yes, yes, yes, {
        id: "metals-coverage",
        category: "market-coverage",
        status: "available",
        description:
          "Precious metals topological vector (MET_SAFE) recorded as live traded and validated during the Phase 1 execution milestone.",
        keywords: ["metals", "precious metals", "gold", "silver", "xau", "met_safe", "commodities"],
        source: "/capabilities/market-coverage",
      }),
      row("Equity index coverage", no, yes, yes, {
        id: "equity-index-coverage",
        category: "market-coverage",
        status: "in-development",
        description:
          "Global equity index topologies (EQ_US_MEGA) monitored by the causal query engine and scheduled for v4.0 pipeline activation.",
        keywords: ["equity index", "indices", "s&p", "nasdaq", "eq_us_mega", "stock index", "benchmarks"],
        source: "/capabilities/market-coverage",
      }),
      row("Energy market coverage", no, yes, yes, {
        id: "energy-market-coverage",
        category: "market-coverage",
        status: "in-development",
        description:
          "Energy infrastructure vector topology (ENG_FUT_VEC) monitored by the causal engine and preparing for v4.0 desk activation.",
        keywords: ["energy", "oil", "crude", "natural gas", "wti", "brent", "eng_fut_vec", "commodities"],
        source: "/capabilities/market-coverage",
      }),
      row("Rates and fixed income", no, optional, yes, {
        id: "rates-and-fixed-income",
        category: "market-coverage",
        status: "planned",
        description:
          "Sovereign yield curves and duration vectors (SOV_DUR_CURVES) on the topological expansion roadmap for multi-domain routing.",
        keywords: ["rates", "fixed income", "bonds", "treasuries", "yield curve", "duration", "sov_dur_curves", "sovereign"],
        source: "/capabilities/market-coverage",
      }),
      row("Equity market coverage", no, optional, yes, {
        id: "equity-market-coverage",
        category: "market-coverage",
        status: "planned",
        description:
          "Single-name equity and sector capital-expenditure nodes (TECH_CAPX_NODES) on the topological roadmap for institutional mandates.",
        keywords: ["equities", "single-name", "stocks", "tech_capx_nodes", "sector", "cash equities"],
        source: "/capabilities/market-coverage",
      }),
      row("Futures and derivatives", no, optional, yes, {
        id: "futures-and-derivatives",
        category: "market-coverage",
        status: "planned",
        description:
          "Cross-asset volatility surfaces (VOL_SRF_SURFACES) and listed derivative topologies planned for institutional bespoke modeling.",
        keywords: ["futures", "derivatives", "options", "volatility surface", "vol_srf_surfaces", "listed derivatives"],
        source: "/capabilities/market-coverage",
      }),
      row("Real-time market data", yes, yes, yes, {
        id: "real-time-market-data",
        category: "market-coverage",
        status: "available",
        description:
          "Continuous low-latency ingestion of market feeds required to compute live structural state transitions and execution directives.",
        keywords: ["real-time", "streaming data", "live data", "ticks", "market data", "feeds"],
        source: "/architecture",
      }),
      row("Historical market data", yes, yes, yes, {
        id: "historical-market-data",
        category: "market-coverage",
        status: "available",
        description:
          "Curated historical price, volatility, and macro series used for structural calibration, parallel-run validation, and attribution review.",
        keywords: ["historical data", "time series", "archive", "market history", "ohlcv"],
        source: "/architecture",
      }),
      row("Cross-asset data normalization", no, yes, yes, {
        id: "cross-asset-data-normalization",
        category: "market-coverage",
        status: "available",
        tooltip: true,
        description:
          "Harmonizes session calendars, contract specifications, and quote conventions across currencies, metals, indices, and energy.",
        keywords: ["normalization", "cross-asset", "schema", "harmonization", "data pipeline", "cleaning"],
        source: "/architecture",
      }),
      row("Data quality monitoring", yes, yes, yes, {
        id: "data-quality-monitoring",
        category: "market-coverage",
        status: "available",
        description:
          "Automated pre-inference validation detecting stale quotes, feed dropouts, and outlier ticks before signals can be generated.",
        keywords: ["data quality", "outlier", "stale tick", "anomaly", "feed integrity", "validation"],
        source: "/architecture",
      }),
      row("Market data lineage", no, yes, yes, {
        id: "market-data-lineage",
        category: "market-coverage",
        status: "in-development",
        tooltip: true,
        description:
          "Maps normalized model input features back to their originating market feed snapshots and transformations.",
        keywords: ["data lineage", "provenance", "feed audit", "input tracking", "transformation"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Source timestamp tracking", yes, yes, yes, {
        id: "source-timestamp-tracking",
        category: "market-coverage",
        status: "available",
        tooltip: true,
        description:
          "Preserves venue, ingestion, and inference timestamps across the pipeline to prevent look-ahead bias.",
        keywords: ["timestamp", "clock", "latency", "ntp", "ptp", "point-in-time", "sequencing"],
        source: "/delivery/zero-latency-webhooks",
      }),
    ],
  },
  {
    id: "portfolio-risk",
    title: "Portfolio Risk & Controls",
    rows: [
      row("Real-time portfolio exposure", no, yes, yes, {
        id: "real-time-portfolio-exposure",
        category: "portfolio-risk",
        status: "available",
        description:
          "Tracks gross and net directional exposure across active desk cohorts so incoming directives are evaluated against current book state.",
        keywords: ["portfolio", "exposure", "real-time", "gross", "net", "book", "risk"],
        source: "/partnerships",
      }),
      row("Portfolio factor decomposition", no, yes, yes, {
        id: "portfolio-factor-decomposition",
        category: "portfolio-risk",
        status: "in-development",
        tooltip: true,
        description:
          "Decomposes aggregate book exposure into underlying macroeconomic, rates, currency, commodity, and volatility risk factors.",
        keywords: ["factor", "decomposition", "portfolio", "risk factors", "beta", "macro loadings"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Concentration risk monitoring", no, yes, yes, {
        id: "concentration-risk-monitoring",
        category: "portfolio-risk",
        status: "planned",
        description:
          "Detects excessive exposure accumulation within a single instrument, cohort, or correlated macro regime prior to directive approval.",
        keywords: ["concentration", "crowding", "correlation", "single-name limit", "exposure cap", "risk"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Liquidity risk analysis", no, yes, yes, {
        id: "liquidity-risk-analysis",
        category: "portfolio-risk",
        status: "planned",
        description:
          "Assesses regime-conditioned market depth, spread widening, and liquidation horizon constraints before sizing execution directives.",
        keywords: ["liquidity", "market depth", "slippage", "spread", "market impact", "risk"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Value at Risk (VaR)", no, yes, yes, {
        id: "value-at-risk",
        category: "portfolio-risk",
        status: "planned",
        tooltip: true,
        description:
          "Estimates parametric and historical portfolio loss thresholds across horizons conditioned on the active volatility regime.",
        keywords: ["var", "value at risk", "quantile", "loss distribution", "portfolio risk", "99%"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Expected Shortfall (CVaR)", no, yes, yes, {
        id: "expected-shortfall",
        category: "portfolio-risk",
        status: "planned",
        tooltip: true,
        description:
          "Quantifies conditional tail loss beyond the VaR threshold during fat-tailed structural regime breaks.",
        keywords: ["cvar", "expected shortfall", "tail risk", "etl", "conditional var", "extreme loss", "risk"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Historical stress testing", no, yes, yes, {
        id: "historical-stress-testing",
        category: "portfolio-risk",
        status: "in-development",
        description:
          "Replays portfolio mandates and exposure constraints through historical liquidity crises, central-bank shocks, and volatility spikes.",
        keywords: ["stress testing", "historical stress", "crisis", "drawdown", "dislocation", "risk"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Custom stress scenarios", no, yes, yes, {
        id: "custom-stress-scenarios",
        category: "portfolio-risk",
        status: "planned",
        description:
          "Allows risk officers and portfolio managers to define bespoke multi-asset shock vectors and evaluate mandate resilience.",
        keywords: ["custom stress", "scenarios", "shock", "hypothetical", "risk committee", "cro"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Drawdown monitoring", yes, yes, yes, {
        id: "drawdown-monitoring",
        category: "portfolio-risk",
        status: "available",
        description:
          "Enforces daily and rolling drawdown limits natively in the telemetry layer, with custom drawdown parameterization for Capital Desk and Institutional.",
        keywords: ["drawdown", "max drawdown", "daily loss", "stop loss", "limit", "risk"],
        source: "/control/native-risk-mandates",
      }),
      row("Position limit enforcement", yes, yes, yes, {
        id: "position-limit-enforcement",
        category: "portfolio-risk",
        status: "available",
        description:
          "Hard-codes maximum gross exposure, notional caps, and lot-sizing scalars so directives cannot breach tenant-defined boundaries.",
        keywords: ["position limit", "exposure cap", "lot size", "notional limit", "mandate", "risk"],
        source: "/control/native-risk-mandates",
      }),
      row("Pre-trade risk checks", yes, yes, yes, {
        id: "pre-trade-risk-checks",
        category: "portfolio-risk",
        status: "available",
        tooltip: true,
        description:
          "Validates drawdown caps, regime eligibility, and macro blackout windows synchronously before any payload is dispatched.",
        keywords: ["pre-trade", "risk check", "gate", "guardrail", "compliance", "veto"],
        source: "/capabilities/risk-control",
      }),
      row("Post-trade risk monitoring", no, yes, yes, {
        id: "post-trade-risk-monitoring",
        category: "portfolio-risk",
        status: "in-development",
        description:
          "Continuously reconciles post-directive exposure, fill slippage, and realized volatility against approved desk risk tolerances.",
        keywords: ["post-trade", "reconciliation", "monitoring", "slippage", "exposure drift", "risk"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Mandatory risk-control handoff", yes, yes, yes, {
        id: "mandatory-risk-control-handoff",
        category: "portfolio-risk",
        status: "available",
        tooltip: true,
        description:
          "Routes every ATRX directive through tenant-owned risk verification before orders can reach execution venues.",
        keywords: ["mandatory handoff", "risk control", "sovereignty", "custody", "execution gate", "risk"],
        source: "/capabilities/risk-control",
      }),
      row("Human approval thresholds", no, yes, yes, {
        id: "human-approval-thresholds",
        category: "portfolio-risk",
        status: "planned",
        tooltip: true,
        description:
          "Holds directives breaching configured notional, conviction, or regime-transition thresholds for explicit operator sign-off.",
        keywords: ["human approval", "hitl", "manual sign-off", "threshold", "maker-checker", "governance"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Automated risk escalation", no, yes, yes, {
        id: "automated-risk-escalation",
        category: "portfolio-risk",
        status: "in-development",
        description:
          "Emits priority risk advisories and escalation events to desk supervisors when utilization approaches drawdown or concentration limits.",
        keywords: ["escalation", "alert", "risk notification", "breach warning", "cro", "risk"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Emergency execution halt", yes, yes, yes, {
        id: "emergency-execution-halt",
        category: "portfolio-risk",
        status: "available",
        tooltip: true,
        description:
          "Immediately suspends directive emission across the pipeline when systemic guardrails or operator kill-switches trigger.",
        keywords: ["kill switch", "emergency halt", "circuit breaker", "veto", "stop", "suspend", "risk"],
        source: "/control/native-risk-mandates",
      }),
    ],
  },
  {
    id: "execution-integration",
    title: "Execution & System Integration",
    rows: [
      row("Standard JSON webhooks", yes, yes, yes, {
        id: "standard-json-webhooks",
        category: "execution-integration",
        status: "available",
        description:
          "Pushes cryptographically signed, schema-validated JSON directive payloads directly to tenant-operated HTTPS endpoints.",
        keywords: ["json", "webhook", "webhooks", "http", "payload", "push", "api"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("REST API access", yes, yes, yes, {
        id: "rest-api-access",
        category: "execution-integration",
        status: "available",
        description:
          "Authenticated HTTP endpoints for querying active regime states, verifying mandate rules, and exporting audit ledger records.",
        keywords: ["rest", "api", "http", "endpoint", "json", "query"],
        source: "/quickstart",
      }),
      row("Streaming API delivery", no, yes, yes, {
        id: "streaming-api-delivery",
        category: "execution-integration",
        status: "available",
        description:
          "Persistent low-latency streaming channels for desks consuming continuous state telemetry and directive updates.",
        keywords: ["streaming", "api", "websocket", "sse", "grpc", "low-latency", "real-time"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Low-latency SDKs", no, yes, yes, {
        id: "low-latency-sdks",
        category: "execution-integration",
        status: "available",
        description:
          "Direct Python and TypeScript/JavaScript SDKs handling signature verification, mandate evaluation, and local venue translation.",
        keywords: ["sdk", "sdks", "python", "typescript", "javascript", "client library", "api"],
        source: "/access/capital-desk",
      }),
      row("FIX protocol integration", no, optional, yes, {
        id: "fix-protocol-integration",
        category: "execution-integration",
        status: "planned",
        tooltip: true,
        description:
          "Translates ATRX directives into standard Financial Information eXchange (FIX) messages for institutional order routing.",
        keywords: ["fix", "fix protocol", "4.2", "4.4", "5.0", "financial information exchange", "order routing"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("OMS/EMS connectivity", no, yes, yes, {
        id: "oms-ems-connectivity",
        category: "execution-integration",
        status: "in-development",
        tooltip: true,
        description:
          "Connects ATRX directive feeds directly to existing order and execution management systems without replatforming.",
        keywords: ["oms", "ems", "order management", "execution management", "pms", "trading system", "api"],
        source: "/partnerships",
      }),
      row("Custom execution routing", no, yes, yes, {
        id: "custom-execution-routing",
        category: "execution-integration",
        status: "available",
        tooltip: true,
        description:
          "Routes directives to specific desk books or execution venues using configurable priority latency rules.",
        keywords: ["routing", "priority latency", "custom routing", "execution", "venue"],
        source: "/access/capital-desk",
      }),
      row("Multi-node allocation", no, yes, yes, {
        id: "multi-node-allocation",
        category: "execution-integration",
        status: "available",
        tooltip: true,
        description:
          "Distributes synchronized directives across multiple desk cohorts or sub-accounts with independent sizing scalars.",
        keywords: ["multi-node", "cohort", "allocation", "sub-account", "distribution", "desk"],
        source: "/access/capital-desk",
      }),
      row("Delivery acknowledgements", yes, yes, yes, {
        id: "delivery-acknowledgements",
        category: "execution-integration",
        status: "available",
        description:
          "Verifies endpoint receipt and cryptographic signature validation for every dispatched directive payload.",
        keywords: ["ack", "acknowledgement", "receipt", "delivery confirmation", "webhook", "hmac"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Retry and failover handling", yes, yes, yes, {
        id: "retry-and-failover-handling",
        category: "execution-integration",
        status: "available",
        description:
          "Bounded retry policies with freshness expiration and secondary endpoint failover to protect against transient network faults.",
        keywords: ["retry", "failover", "backoff", "resilience", "dead letter", "delivery"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Idempotent event delivery", yes, yes, yes, {
        id: "idempotent-event-delivery",
        category: "execution-integration",
        status: "available",
        tooltip: true,
        description:
          "Attaches deterministic sequence keys to every payload so reconnects never trigger duplicate order execution.",
        keywords: ["idempotent", "idempotency", "deduplication", "sequence id", "exactly-once", "webhook"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Execution latency monitoring", no, yes, yes, {
        id: "execution-latency-monitoring",
        category: "execution-integration",
        status: "available",
        description:
          "Tracks end-to-end dispatch, network transit, and tenant-acknowledgement timings during paper-trading and live operation.",
        keywords: ["latency", "monitoring", "rtt", "dispatch time", "slippage", "telemetry"],
        source: "/partnerships",
      }),
      row("Integration sandbox", yes, yes, yes, {
        id: "integration-sandbox",
        category: "execution-integration",
        status: "available",
        tooltip: true,
        description:
          "Provides a parallel paper-trading environment to validate webhooks, risk handoffs, and venue adapters before live deployment.",
        keywords: ["sandbox", "paper trading", "parallel run", "staging", "test environment", "simulation"],
        source: "/partnerships",
      }),
      row("Custom integration adapters", no, optional, yes, {
        id: "custom-integration-adapters",
        category: "execution-integration",
        status: "qualification",
        tooltip: true,
        description:
          "Develops bespoke payload schemas and internal message-bus bridges through direct institutional engineering engagements.",
        keywords: ["custom adapter", "bespoke integration", "kafka", "ibmmq", "engineering sync", "bridge"],
        source: "/access/institutional",
      }),
    ],
  },
  {
    id: "model-governance",
    title: "Model Governance & Auditability",
    rows: [
      row("Model version governance", yes, yes, yes, {
        id: "model-version-management",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Pins and records the exact model ensemble and parameter release on every state classification and directive.",
        keywords: ["model version", "model version management", "versioning", "release", "lineage", "governance", "audit"],
        source: "/delivery/audit-grade-ledgers",
      }),
      row("Research methodology documentation", yes, yes, yes, {
        id: "research-methodology-documentation",
        category: "model-governance",
        status: "available",
        description:
          "Structured documentation of ATRX’s causal state architecture, signal isolation discipline, and risk-handoff design.",
        keywords: ["methodology", "documentation", "philosophy", "research", "model risk", "mrm"],
        source: "/philosophy",
      }),
      row("Model validation workflows", no, yes, yes, {
        id: "model-validation-workflows",
        category: "model-governance",
        status: "in-development",
        tooltip: true,
        description:
          "Provides standardized evaluation packages supporting institutional model-risk management (MRM) review and parallel-run sign-off.",
        keywords: ["model validation", "mrm", "sr 11-7", "governance", "out-of-sample", "review"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Model performance monitoring", no, yes, yes, {
        id: "model-performance-monitoring",
        category: "model-governance",
        status: "available",
        description:
          "Continuous tracking of structural state accuracy, signal hit rates, and risk-adjusted attribution across active vectors.",
        keywords: ["performance monitoring", "hit rate", "sharpe", "calibration", "decay", "evaluation"],
        source: "/performance",
      }),
      row("Drift detection", no, yes, yes, {
        id: "drift-detection",
        category: "model-governance",
        status: "in-development",
        tooltip: true,
        description:
          "Monitors input features, regime covariance, and model calibration for statistical divergence from baseline distributions.",
        keywords: ["drift", "concept drift", "data drift", "covariate shift", "monitoring", "model risk"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Decision provenance", yes, yes, yes, {
        id: "decision-provenance",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Links every emitted or vetoed directive to its timestamp, regime state, catalyst tag, and active mandate.",
        keywords: ["decision provenance", "audit", "lineage", "rationale", "traceability", "governance"],
        source: "/capabilities/causal-attribution",
      }),
      row("Explainable signal attribution", yes, yes, yes, {
        id: "explainable-signal-attribution",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Decomposes model directives into observable macroeconomic transmission channels and volatility states for human review.",
        keywords: ["explainability", "xai", "signal attribution", "interpretable", "transparent", "rationale"],
        source: "/capabilities/causal-attribution",
      }),
      row("Reproducible research outputs", no, yes, yes, {
        id: "reproducible-research-outputs",
        category: "model-governance",
        status: "in-development",
        description:
          "Enables deterministic reconstruction of historical inference outputs from frozen market data snapshots and pinned model versions.",
        keywords: ["reproducible", "reproducibility", "deterministic", "replay", "audit", "verification"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Immutable audit records", no, yes, yes, {
        id: "immutable-audit-records",
        category: "model-governance",
        status: "available",
        description:
          "Append-only, machine-readable telemetry ledgers capturing all state classifications, execution directives, and risk veto events.",
        keywords: ["immutable", "audit", "audit records", "ledger", "ledgers", "tamper-evident", "compliance"],
        source: "/delivery/audit-grade-ledgers",
      }),
      row("Historical decision reconstruction", no, yes, yes, {
        id: "historical-decision-reconstruction",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Reconstructs the sequence of model states, mandate checks, and veto reasons for post-trade committee review.",
        keywords: ["reconstruction", "post-mortem", "audit", "decision history", "veto log", "governance"],
        source: "/delivery/audit-grade-ledgers",
      }),
      row("Policy-based model controls", no, yes, yes, {
        id: "policy-based-model-controls",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Defines declarative regime-gating rules governing which structural states and vectors may emit actionable directives.",
        keywords: ["policy", "regime gating", "model controls", "rules", "mandate", "risk"],
        source: "/access/capital-desk",
      }),
      row("Human override controls", yes, yes, yes, {
        id: "human-override-controls",
        category: "model-governance",
        status: "available",
        description:
          "Preserves full tenant authority to override, scale down, or reject any ATRX directive inside the local execution environment.",
        keywords: ["human override", "manual intervention", "sovereignty", "veto", "operator control"],
        source: "/partnerships",
      }),
      row("Model change approvals", no, optional, yes, {
        id: "model-change-approvals",
        category: "model-governance",
        status: "planned",
        description:
          "Change-management workflow providing institutional tenants advance notice, ablation summaries, and approval gates before model upgrades.",
        keywords: ["change approval", "model update", "release gate", "change management", "governance"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Research ablation studies", no, no, yes, {
        id: "research-ablation-studies",
        category: "model-governance",
        status: "available",
        tooltip: true,
        description:
          "Provides technical whitepapers and component ablation studies quantifying the contribution of each architectural module.",
        keywords: ["ablation", "whitepaper", "whitepapers", "research", "benchmarks", "validation"],
        source: "/access/institutional",
      }),
    ],
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security & Administration",
    rows: [
      row("Multi-factor authentication", yes, yes, yes, {
        id: "multi-factor-authentication",
        category: "enterprise-security",
        status: "available",
        description:
          "Hardware security key and authenticator-based multi-factor authentication required for operator and administrative access.",
        keywords: ["mfa", "2fa", "two-factor", "webauthn", "totp", "authentication", "security"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Single sign-on (SSO)", no, yes, yes, {
        id: "single-sign-on",
        category: "enterprise-security",
        status: "planned",
        description:
          "Centralized enterprise authentication allowing institutional users to sign in through their organization’s identity provider.",
        keywords: ["sso", "single sign-on", "single sign on", "federation", "idp", "okta", "entra", "ping"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("SAML/OIDC authentication", no, yes, yes, {
        id: "saml-oidc-authentication",
        category: "enterprise-security",
        status: "planned",
        tooltip: true,
        description:
          "Federates institutional sign-in through SAML 2.0 and OpenID Connect identity providers with conditional access policies.",
        keywords: ["saml", "oidc", "openid connect", "oauth", "sso", "authentication", "idp"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("SCIM user provisioning", no, no, yes, {
        id: "scim-user-provisioning",
        category: "enterprise-security",
        status: "planned",
        tooltip: true,
        description:
          "Automates user onboarding, group synchronization, and immediate deprovisioning from enterprise directory services.",
        keywords: ["scim", "provisioning", "deprovisioning", "directory sync", "active directory", "iam"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Role-based access control", no, yes, yes, {
        id: "role-based-access-control",
        category: "enterprise-security",
        status: "in-development",
        description:
          "Predefined and custom permission roles separating researcher, trader, risk officer, and system administrator responsibilities.",
        keywords: ["rbac", "role-based", "permissions", "access control", "least privilege", "iam"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Attribute-based access control", no, no, yes, {
        id: "attribute-based-access-control",
        category: "enterprise-security",
        status: "planned",
        tooltip: true,
        description:
          "Restricts data, mandate, and execution-node entitlements dynamically by desk, asset class, or legal entity.",
        keywords: ["abac", "attribute-based", "fine-grained", "policy", "entitlements", "iam"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Tenant-level permissions", yes, yes, yes, {
        id: "tenant-level-permissions",
        category: "enterprise-security",
        status: "available",
        tooltip: true,
        description:
          "Isolates API credentials, mandate parameters, and telemetry logs strictly within each organization’s tenant boundary.",
        keywords: ["tenant isolation", "permissions", "multi-tenancy", "single-tenant", "boundary", "security"],
        source: "/partnerships",
      }),
      row("IP allowlisting", yes, yes, yes, {
        id: "ip-allowlisting",
        category: "enterprise-security",
        status: "available",
        description:
          "Restricts API queries and outbound webhook dispatch to explicitly authorized tenant CIDR blocks and static ingress addresses.",
        keywords: ["ip allowlist", "whitelist", "cidr", "firewall", "network security", "egress"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Private network connectivity", no, optional, yes, {
        id: "private-network-connectivity",
        category: "enterprise-security",
        status: "qualification",
        tooltip: true,
        description:
          "Routes traffic over AWS PrivateLink, GCP Private Service Connect, or VPC peering off the public internet.",
        keywords: ["private network", "privatelink", "vpc peering", "private service connect", "vpn", "interconnect"],
        source: "/access/institutional",
      }),
      row("Encryption in transit", yes, yes, yes, {
        id: "encryption-in-transit",
        category: "enterprise-security",
        status: "available",
        description:
          "Enforces modern TLS encryption and cryptographic payload signing across all external API, SDK, and webhook communications.",
        keywords: ["tls", "mtls", "encryption in transit", "https", "hmac", "cryptography", "security"],
        source: "/delivery/zero-latency-webhooks",
      }),
      row("Encryption at rest", yes, yes, yes, {
        id: "encryption-at-rest",
        category: "enterprise-security",
        status: "available",
        description:
          "Encrypts stored tenant configurations, historical state series, and audit-ledger exports using envelope encryption.",
        keywords: ["encryption at rest", "aes-256", "storage encryption", "disk encryption", "security"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Customer-managed encryption keys", no, no, yes, {
        id: "customer-managed-encryption-keys",
        category: "enterprise-security",
        status: "planned",
        tooltip: true,
        description:
          "Lets institutional tenants control and revoke storage encryption keys through their own cloud KMS (CMEK/BYOK).",
        keywords: ["cmek", "byok", "kms", "customer-managed keys", "encryption keys", "hsm", "security"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Secrets and credential rotation", yes, yes, yes, {
        id: "secrets-and-credential-rotation",
        category: "enterprise-security",
        status: "available",
        tooltip: true,
        description:
          "Supports zero-downtime dual-key rotation for webhook signing secrets while keeping venue keys inside tenant infrastructure.",
        keywords: ["secrets", "credential rotation", "api keys", "key rotation", "signing secret", "security"],
        source: "/partnerships",
      }),
      row("Data residency controls", no, no, yes, {
        id: "data-residency-controls",
        category: "enterprise-security",
        status: "qualification",
        tooltip: true,
        description:
          "Constrains telemetry storage, audit ledgers, and inference compute to approved regional cloud jurisdictions.",
        keywords: ["data residency", "sovereignty", "gdpr", "jurisdiction", "region", "compliance"],
        source: "/access/institutional",
      }),
      row("Administrative audit logs", no, yes, yes, {
        id: "administrative-audit-logs",
        category: "enterprise-security",
        status: "in-development",
        description:
          "Records authentication events, role assignments, API key rotations, and mandate configuration changes for security and SIEM ingestion.",
        keywords: ["admin audit", "audit logs", "siem", "security logs", "access logs", "activity log"],
        source: "ATRX Product Specification · v4.0",
      }),
    ],
  },
  {
    id: "infrastructure-reliability",
    title: "Infrastructure & Reliability",
    rows: [
      row("Single-tenant deployment", yes, yes, yes, {
        id: "single-tenant-deployment",
        category: "infrastructure-reliability",
        status: "available",
        tooltip: true,
        description:
          "Dedicates an isolated execution pipeline and mandate state per tenant to eliminate cross-tenant compute contention.",
        keywords: ["single-tenant", "isolated pipeline", "tenancy", "deployment", "infrastructure"],
        source: "/access/prosumer-node",
      }),
      row("Multi-node infrastructure", no, yes, yes, {
        id: "multi-node-infrastructure",
        category: "infrastructure-reliability",
        status: "available",
        tooltip: true,
        description:
          "Deploys distributed runtime nodes supporting parallel cohort pipelines and high-availability directive dispatch.",
        keywords: ["multi-node", "distributed", "cluster", "high availability", "ha", "infrastructure"],
        source: "/access/capital-desk",
      }),
      row("Dedicated inference clusters", no, no, yes, {
        id: "dedicated-inference-clusters",
        category: "infrastructure-reliability",
        status: "available",
        tooltip: true,
        description:
          "Provisions isolated GPU/CPU inference clusters exclusively for a single institution with no shared compute substrate.",
        keywords: ["dedicated cluster", "inference cluster", "isolated compute", "bare metal", "gpu"],
        source: "/access/institutional",
      }),
      row("AWS deployment", optional, optional, yes, {
        id: "aws-deployment",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Supports dedicated institutional inference cluster deployment on Amazon Web Services aligned with tenant VPC infrastructure.",
        keywords: ["aws", "amazon web services", "cloud", "ec2", "eks", "vpc"],
        source: "/access/institutional",
      }),
      row("GCP deployment", optional, optional, yes, {
        id: "gcp-deployment",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Supports dedicated institutional inference cluster deployment on Google Cloud Platform aligned with tenant cloud topology.",
        keywords: ["gcp", "google cloud", "cloud", "gke", "vpc"],
        source: "/access/institutional",
      }),
      row("Private cloud connectivity", no, optional, yes, {
        id: "private-cloud-connectivity",
        category: "infrastructure-reliability",
        status: "qualification",
        description:
          "Dedicated cross-account cloud networking and private routing between ATRX inference nodes and institutional execution environments.",
        keywords: ["private cloud", "direct connect", "cloud interconnect", "vpc", "hybrid cloud"],
        source: "/access/institutional",
      }),
      row("Regional deployment options", no, optional, yes, {
        id: "regional-deployment-options",
        category: "infrastructure-reliability",
        status: "qualification",
        tooltip: true,
        description:
          "Places inference and routing nodes in cloud regions proximate to the institution’s primary execution gateways.",
        keywords: ["regional", "multi-region", "colocation", "proximity", "us-east", "eu-west", "apac"],
        source: "/access/institutional",
      }),
      row("Horizontal scaling", no, yes, yes, {
        id: "horizontal-scaling",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Scales node throughput and cohort concurrency in step with expanded instrument coverage and desk capacity allocations.",
        keywords: ["horizontal scaling", "autoscaling", "capacity", "throughput", "scale"],
        source: "/access/capital-desk",
      }),
      row("System observability", no, yes, yes, {
        id: "system-observability",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Exposes structured health, throughput, and pipeline-stage telemetry for operational monitoring by desk engineering teams.",
        keywords: ["observability", "telemetry", "metrics", "prometheus", "opentelemetry", "monitoring"],
        source: "/access/institutional",
      }),
      row("Latency telemetry", no, yes, yes, {
        id: "latency-telemetry",
        category: "infrastructure-reliability",
        status: "available",
        tooltip: true,
        description:
          "Measures stage-by-stage timings across data ingestion, regime evaluation, mandate checks, and webhook dispatch.",
        keywords: ["latency telemetry", "timing", "jitter", "p99", "sub-second", "performance"],
        source: "/access/capital-desk",
      }),
      row("Service health monitoring", yes, yes, yes, {
        id: "service-health-monitoring",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Continuous automated heartbeat checks verifying upstream data feeds, model runtime readiness, and outbound delivery channels.",
        keywords: ["health check", "heartbeat", "status", "liveness", "uptime", "monitoring"],
        source: "/architecture",
      }),
      row("Backup and recovery", yes, yes, yes, {
        id: "backup-and-recovery",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Point-in-time backups of tenant mandate rules, state history, and audit ledgers for rapid operational restoration.",
        keywords: ["backup", "restore", "recovery", "snapshot", "persistence", "resilience"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Disaster recovery planning", no, optional, yes, {
        id: "disaster-recovery-planning",
        category: "infrastructure-reliability",
        status: "qualification",
        tooltip: true,
        description:
          "Establishes multi-zone redundancy and coordinated failover runbooks aligned with institutional recovery objectives.",
        keywords: ["disaster recovery", "dr", "bcp", "business continuity", "failover", "rto", "rpo"],
        source: "/access/institutional",
      }),
      row("Incident notifications", yes, yes, yes, {
        id: "incident-notifications",
        category: "infrastructure-reliability",
        status: "available",
        description:
          "Automated operational notifications for upstream market-feed disruptions, scheduled maintenance, or pipeline anomalies.",
        keywords: ["incident", "notifications", "alerts", "outage", "advisory", "status"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Contractual service-level agreements", no, optional, yes, {
        id: "contractual-service-level-agreements",
        category: "infrastructure-reliability",
        status: "qualification",
        description:
          "Formal operational availability, incident-response, and support commitments defined within negotiated institutional agreements.",
        keywords: ["sla", "service level agreement", "contractual", "uptime commitment", "support terms"],
        source: "/access/institutional",
      }),
    ],
  },
  {
    id: "institutional-workflows",
    title: "Institutional Workflows & Collaboration",
    rows: [
      row("Shared research workspaces", no, yes, yes, {
        id: "shared-research-workspaces",
        category: "institutional-workflows",
        status: "planned",
        description:
          "Shared environment enabling quantitative researchers, strategists, and PMs to inspect identical regime states and catalyst trees.",
        keywords: ["workspace", "shared research", "collaboration", "team", "notes", "desk"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Team access controls", no, yes, yes, {
        id: "team-access-management",
        category: "institutional-workflows",
        status: "in-development",
        description:
          "Centralized seat, cohort, and credential administration for multi-user trading desks and research teams.",
        keywords: ["team access", "team access management", "seat management", "user management", "desk admin", "organization"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Multi-team collaboration", no, no, yes, {
        id: "multi-team-collaboration",
        category: "institutional-workflows",
        status: "planned",
        tooltip: true,
        description:
          "Partitions multi-desk and multi-strategy organizations with information barriers while permitting shared macro research views.",
        keywords: ["multi-team", "multi-strategy", "cross-desk", "information barrier", "enterprise"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Research approval workflows", no, yes, yes, {
        id: "research-approval-workflows",
        category: "institutional-workflows",
        status: "planned",
        tooltip: true,
        description:
          "Enforces structured review and sign-off gates before research configuration changes reach live desk mandates.",
        keywords: ["approval workflow", "research review", "sign-off", "governance", "committee"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Research history and archiving", yes, yes, yes, {
        id: "research-history-and-archiving",
        category: "institutional-workflows",
        status: "available",
        description:
          "Long-term retention of emitted state classifications, causal attribution tags, and risk veto records for historical review.",
        keywords: ["research history", "archiving", "retention", "recordkeeping", "historical log"],
        source: "/delivery/audit-grade-ledgers",
      }),
      row("Research export", yes, yes, yes, {
        id: "research-export",
        category: "institutional-workflows",
        status: "available",
        description:
          "Exports machine-readable state classifications, attribution series, and decision logs for downstream notebooks and internal models.",
        keywords: ["export", "csv", "json", "parquet", "download", "research data"],
        source: "/delivery/audit-grade-ledgers",
      }),
      row("Scheduled intelligence delivery", yes, yes, yes, {
        id: "scheduled-intelligence-delivery",
        category: "institutional-workflows",
        status: "in-development",
        description:
          "Configurable session-open and end-of-day intelligence summaries covering regime posture, transition risks, and factor attribution.",
        keywords: ["scheduled delivery", "digest", "briefing", "cadence", "session report"],
        source: "ATRX Product Specification · v4.0",
      }),
      row("Portfolio-level reporting", no, yes, yes, {
        id: "portfolio-level-reporting",
        category: "institutional-workflows",
        status: "in-development",
        description:
          "Consolidated attribution, regime-exposure, and mandate-utilization reports across all cohorts assigned to a desk.",
        keywords: ["portfolio reporting", "attribution report", "desk summary", "exposure report"],
        source: "/partnerships",
      }),
      row("Custom intelligence dashboards", no, yes, yes, {
        id: "custom-intelligence-dashboards",
        category: "institutional-workflows",
        status: "planned",
        description:
          "Configurable monitoring layouts tailored to specific macro vectors, desk mandates, and risk-committee review cadences.",
        keywords: ["dashboard", "custom views", "monitoring ui", "visualization", " cockpit"],
        source: "ATRX Institutional Capability Roadmap",
      }),
      row("Custom reporting integrations", no, no, yes, {
        id: "custom-reporting-integrations",
        category: "institutional-workflows",
        status: "qualification",
        tooltip: true,
        description:
          "Streams structured attribution and governance feeds directly into institutional data warehouses and internal reporting pipelines.",
        keywords: ["reporting integration", "snowflake", "bigquery", "data warehouse", "bi", "export pipeline"],
        source: "/access/institutional",
      }),
      row("Institutional onboarding", no, yes, yes, {
        id: "institutional-onboarding",
        category: "institutional-workflows",
        status: "available",
        tooltip: true,
        description:
          "Guides implementation through architecture alignment, a paper-trading parallel run, and latency validation before live capital.",
        keywords: ["onboarding", "architecture sync", "parallel run", "implementation", "rollout"],
        source: "/partnerships",
      }),
      row("Technical implementation support", no, yes, yes, {
        id: "technical-implementation-support",
        category: "institutional-workflows",
        status: "available",
        description:
          "Dedicated integration assistance for Capital Desk deployments and direct ongoing engineering syncs for Institutional engagements.",
        keywords: ["support", "engineering sync", "implementation", "technical account", "integration help"],
        source: "/access/institutional",
      }),
    ],
  },
];
