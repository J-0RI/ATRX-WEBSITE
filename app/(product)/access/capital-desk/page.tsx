import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";
import { ProductSteps } from "@/components/ProductContent";
import { tiers } from "@/content/tiers";
const tier = tiers[1];
export const metadata: Metadata = { title: "Capital Desk", description: "Tier II: multi-node cohort allocation, custom regime gating, drawdown parameters and direct integration SDKs." };
export default function CapitalDeskPage() {
  return <>
    {/* Sources: content/tiers.ts Tier II; partnerships sovereignty/venues. */}
    <DocHeader eyebrow={tier.tier} title={tier.name}><p>{tier.description} The desk connects ATRX intelligence to its existing execution infrastructure while retaining authority over capital controls.</p></DocHeader>
    <DocSection title="A deployment shaped around the desk">
      <EntryList entries={[
        { label: "Cohort allocation", body: "Multi-node deployment provides the Tier II configuration for cohort allocation. Your desk continues to set gross exposure, lot sizing scalars and instrument permissions." },
        { label: "Custom control parameters", body: "Tier II includes custom regime gating and drawdown parameterization. Regime eligibility and desk limits remain distinct checks: a structural opportunity does not override the mandatory risk-control handoff." },
        { label: "Direct integration", body: "The tier includes direct low-latency integration SDKs and priority latency routing. Enterprise integration material describes translation to the venues and broker APIs already used by the desk." },
        { label: "Expanded topology", body: <>The tier describes Indices and Energy alongside the core instrument context. The instrument register lists the corresponding global-index and energy nodes as preparing for v4.0; tier scope does not establish live activation. Consult <Link href="/capabilities/market-coverage">Market Coverage</Link> for status.</> },
      ]} />
    </DocSection>
    {/* Source: partnerships deployment. */}
    <DocSection title="Bring the connection into service">
      <ProductSteps steps={[
        { title: "Architecture sync", body: "Enterprise deployment begins with a technical architecture discussion around the receiving environment and integration." },
        { title: "Parallel run", body: "Paper trading runs inside the tenant environment before live capital is introduced." },
        { title: "Validate execution", body: "The process moves to live capital only after latency and slippage validation. The public tier description does not publish a numeric SLA." },
      ]} />
    </DocSection>
    {/* Sources: contact/engagements.ts capital desk; tiers/access. */}
    <DocSection title="Frame the desk request">
      <Prose><p>Describe the team or desk, markets of interest, integration objective and risk or execution environment. Include operating constraints so the request reflects how the desk intends to use the multi-node deployment.</p><p>The commercial basis is <strong>Base + Capacity</strong>, by application. Pricing follows technical qualification, and admission depends on available compute capacity and infrastructure alignment.</p></Prose>
      <Actions><Link href={tier.apply} className="btn btn-primary">Apply for Capital Desk</Link><Link href="/access" className="btn btn-secondary">Compare tiers</Link></Actions>
      <Note>No public package name, broker compatibility list or numeric delivery guarantee is specified by the existing integration material.</Note>
    </DocSection>
    <Related links={[{ label: "Regime & State Analysis", href: "/capabilities/regime-state-analysis" }, { label: "Native Risk Mandates", href: "/control/native-risk-mandates" }, { label: "Causal Attribution", href: "/capabilities/causal-attribution" }]} />
  </>;
}
