import type { Metadata } from "next";
import { DocHeader, DocSection, EntryList, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description:
    "Systematic execution carries inherent structural risk. Disclosures governing deployment of the ATRX intelligence architecture.",
};

export default function RiskPage() {
  return (
    <>
      <DocHeader eyebrow="Risk Disclosure" title="Systematic execution carries inherent structural risk.">
        <p>
          The disclosures below govern the deployment of the ATRX intelligence architecture across
          all tenant endpoints and capital environments.
        </p>
        <p>
          ATRX deploys deterministic quantitative models that carry inherent risk, including the
          potential for loss of principal capital. This disclosure outlines the specific mechanical
          and market-driven risks associated with autonomous execution.
        </p>
      </DocHeader>

      <DocSection id="disclosures" title="Disclosures">
        <EntryList
          entries={[
            {
              id: "historical-validation",
              label: "Historical Validation",
              body: "Performance metrics documented during the Q1 2026 validation window represent past execution data. Documented historical performance does not guarantee future operational yield. Market conditions, structural regime decay, and execution friction will materially impact forward returns.",
            },
            {
              id: "algorithmic-risk",
              label: "Algorithmic & Causal Risk",
              body: "While the architecture utilizes formal methodologies to suppress spurious correlation, algorithmic systems are subject to model misspecification, unanticipated macroeconomic shocks, and data feed latency. Interventional logic cannot perfectly predict market reflexivity.",
            },
            {
              id: "counterparty",
              label: "Execution & Counterparty",
              body: "ATRX computes intelligence; it does not custody capital. The tenant assumes all counterparty risk associated with their chosen brokerage or liquidity provider. ATRX is not liable for broker insolvency, API downtime, spread widening, or slippage incurred during high-volatility regime shifts.",
            },
            {
              id: "jurisdiction",
              label: "Jurisdictional Governance",
              body: "The deployment of automated trading pipelines is subject to varied global regulation. Enterprise tenants are strictly responsible for ensuring their use of the ATRX SDK complies with local financial law, capital reporting, and tax obligations.",
            },
            {
              id: "capacity",
              label: "System Capacity",
              body: "ATRX provides execution payloads and topological research. It does not provide individualized financial advice or guarantee capital preservation. Tenants retain ultimate discretionary authority over their API keys and capital deployment sizing.",
            },
          ]}
        />
      </DocSection>

      <Related
        links={[
          { label: "Phase 1 performance", href: "/performance" },
          { label: "Access tiers", href: "/access" },
          { label: "Contact engineering", href: "/contact" },
        ]}
      />
    </>
  );
}
