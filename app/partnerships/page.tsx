import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList, Prose, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Enterprise Tenancy",
  description: "ATRX integrates with enterprise trading desks as a parallel intelligence layer.",
};

const integration = [
  {
    id: "risk-mandates",
    label: "Native Risk Mandates",
    title: "01",
    body: "The execution node respects daily drawdown limits, exposure caps, and macroeconomic blackout windows natively. Capital protection is hard-coded into the telemetry layer.",
  },
  {
    id: "webhooks",
    label: "Zero-Latency Webhooks",
    title: "02",
    body: "The ATRX intelligence cloud streams signed, schema-validated execution payloads directly to your server infrastructure. API credentials never leave your local environment.",
  },
  {
    id: "attribution",
    label: "Causal Attribution",
    title: "03",
    body: "Every execution payload carries a regime tag and a structural identifier. Desks can attribute P&L back to exact macroeconomic catalysts and volatility states.",
  },
  {
    id: "venues",
    label: "Venue Independence",
    title: "04",
    body: "Provided enterprise-grade SDKs support translation to the venues and broker APIs your desk already operates on.",
  },
  {
    id: "sovereignty",
    label: "Operational Sovereignty",
    title: "05",
    body: "Your desk controls gross exposure, lot sizing scalars, and instrument permissions. ATRX computes the structural intelligence. You control the capital.",
  },
  {
    id: "ledgers",
    label: "Audit-Grade Ledgers",
    title: "06",
    body: "Decision logs, state classifications, and risk veto events are exported in machine-readable formats for internal quantitative governance and review.",
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <DocHeader
        eyebrow="Tenancy · Enterprise desks · Quantitative allocators"
        title="A parallel intelligence layer for enterprise capital."
      >
        <p>
          ATRX is engineered to integrate with enterprise trading desks as a centralized
          intelligence core. Validated telemetry reaches the firm&apos;s execution nodes through
          their existing infrastructure. Zero replatforming. Zero migration risk.
        </p>
      </DocHeader>

      <DocSection id="integration" title="Distributed integration">
        <EntryList entries={integration} />
      </DocSection>

      <DocSection id="engagement" title="Engagement models">
        <EntryList
          entries={[
            {
              label: "Dedicated Tenant Pipeline",
              body: "The enterprise firm connects directly to the ATRX routing engine. ATRX provides the infrastructure, continuous model realignment, and sub-second signal delivery.",
            },
            {
              label: "Capital Allocation Partner",
              body: "For family offices and institutional allocators, ATRX engages as a quantitative manager with negotiated allocation limits, performance terms, and structural reporting.",
            },
          ]}
        />
      </DocSection>

      <DocSection id="deployment" title="Deployment process">
        <Prose>
          <p>
            Engagements open with a technical architecture sync. The relationship proceeds to a
            paper-trading parallel run inside your environment, converting to live capital only
            after latency and slippage validation.
          </p>
        </Prose>
        <Actions>
          <Link href="/contact?engagement=tier-2" className="btn btn-primary">
            Request enterprise deployment
          </Link>
        </Actions>
      </DocSection>

      <Related
        links={[
          { label: "Access tiers", href: "/access" },
          { label: "System architecture", href: "/architecture" },
          { label: "Risk disclosure", href: "/risk" },
        ]}
      />
    </>
  );
}
