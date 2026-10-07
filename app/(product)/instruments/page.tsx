import type { Metadata } from "next";
import { DocHeader, DocSection, EntryList, Note, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Instruments",
  description: "Multi asset by architecture. Disciplined by deployment. ATRX instrument vectors and roadmap.",
};

export default function InstrumentsPage() {
  return (
    <>
      <DocHeader title="Multi asset by architecture. Disciplined by deployment.">
        <p>
          Forex, metals, indices, and commodities today. Equities, fixed income, and decentralized
          liquidity tomorrow. The same core architecture deploys everywhere.
        </p>
      </DocHeader>

      <DocSection id="live" title="Live traded">
        <EntryList
          mono
          entries={[
            { label: "MET_SAFE", body: "Precious Metals Vector" },
            { label: "FX_DM", body: "Developed FX Vector" },
          ]}
        />
        <Note>Executed during the Phase 1 validation milestone.</Note>
      </DocSection>

      <DocSection id="v4" title="Preparing for v4.0">
        <EntryList
          mono
          entries={[
            { label: "FX_DM_BASKET", body: "Developed Currency Vectors" },
            { label: "DLR_INDEX_VEC", body: "Macro Sovereign Basket" },
            { label: "EQ_US_MEGA", body: "Global Index Topologies" },
            { label: "ENG_FUT_VEC", body: "Energy Infrastructure Node" },
          ]}
        />
        <Note>Monitored by the causal query engine; scheduled for v4.0 pipeline activation.</Note>
      </DocSection>

      <DocSection id="roadmap" title="Topological roadmap">
        <EntryList
          mono
          entries={[
            { label: "TECH_CAPX_NODES", body: "Single-Name Equity Vectors" },
            { label: "SOV_DUR_CURVES", body: "Sovereign Fixed Income" },
            { label: "VOL_SRF_SURFACES", body: "Cross-Asset Volatility" },
          ]}
        />
        <Note>Target expansion vectors for multi-domain MoE routing.</Note>
      </DocSection>

      <Related
        links={[
          { label: "Access tiers and instrument coverage", href: "/access" },
          { label: "System architecture", href: "/architecture" },
          { label: "Phase 1 performance", href: "/performance" },
        ]}
      />
    </>
  );
}
