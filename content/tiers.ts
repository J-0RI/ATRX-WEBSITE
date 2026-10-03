/* Access families, sourced from atrx.tech/access. No prices are published: access is by application. */

export type Tier = {
  id: string;
  name: string;
  tier: string;
  description: string;
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
    apply: "/contact?engagement=tier-1",
  },
  {
    id: "capital-desk",
    name: "Capital Desk",
    tier: "Tier II · Enterprise",
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
    apply: "/contact?engagement=tier-2",
  },
  {
    id: "institutional",
    name: "Institutional",
    tier: "Tier III",
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
    apply: "/contact?engagement=tier-3",
  },
];
