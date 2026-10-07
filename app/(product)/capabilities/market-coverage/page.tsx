import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";
export const metadata: Metadata = { title: "Market Coverage", description: "ATRX instrument coverage, separating live-traded Phase 1 vectors from preparing-v4.0 and roadmap topology." };
export default function MarketCoveragePage() {
  return <>
    {/* Source: instruments page status-specific sections, which are more precise than its broad introduction. */}
    <DocHeader title="Market Coverage"><p>Instrument topology and deployment status are different questions. ATRX’s published instrument record separates live-traded vectors from those preparing for v4.0 and those on the topological roadmap.</p></DocHeader>
    <DocSection title="Live traded · Phase 1 validation">
      <EntryList mono entries={[
        { label: "MET_SAFE", title: "Precious Metals Vector", body: "The Metals vector recorded as live traded and executed during the Phase 1 validation milestone." },
        { label: "FX_DM", title: "Developed FX Vector", body: "The developed-FX vector recorded as live traded and executed during the same validation milestone." },
      ]} />
      <Note>This is the live-traded scope identified by the published instrument record. It does not establish availability for every tenant or expand the validation record to other vectors.</Note>
    </DocSection>
    <DocSection title="Preparing for v4.0">
      <EntryList mono entries={[
        { label: "FX_DM_BASKET", body: "Developed Currency Vectors" },
        { label: "DLR_INDEX_VEC", body: "Macro Sovereign Basket" },
        { label: "EQ_US_MEGA", body: "Global Index Topologies" },
        { label: "ENG_FUT_VEC", body: "Energy Infrastructure Node" },
      ]} />
      <Note>These vectors are monitored by the causal query engine and listed for v4.0 pipeline activation. They remain in the preparing category; the record does not provide a launch date.</Note>
    </DocSection>
    <DocSection title="Topological roadmap">
      <EntryList mono entries={[
        { label: "TECH_CAPX_NODES", body: "Single-Name Equity Vectors" },
        { label: "SOV_DUR_CURVES", body: "Sovereign Fixed Income" },
        { label: "VOL_SRF_SURFACES", body: "Cross-Asset Volatility" },
      ]} />
      <Note>Target expansion vectors for multi-domain MoE routing. Roadmap inclusion is not a statement of current live support.</Note>
    </DocSection>
    {/* Sources: tiers I/II/III; contact market-interest field caveat. */}
    <DocSection title="Relate coverage to an access mode">
      <Prose><p><Link href="/access/prosumer-node">Prosumer Node</Link> describes access to the core FX and Metals topological vectors. <Link href="/access/capital-desk">Capital Desk</Link> describes expanded topology for Indices and Energy, whose corresponding nodes are still listed above as preparing. <Link href="/access/institutional">Institutional</Link> provides bespoke structural topology modeling, without a separate published list of live markets.</p><p>Use these tier descriptions to frame the deployment discussion alongside the status record. Markets of interest supplied in an application express the requested scope; they do not confirm availability.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Compare access tiers", href: "/access" }, { label: "Instrument register", href: "/instruments" }, { label: "Phase 1 performance", href: "/performance" }]} />
  </>;
}
