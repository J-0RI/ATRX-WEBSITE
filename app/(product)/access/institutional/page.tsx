import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList, Panel, Prose, Related } from "@/components/Doc";
import { tiers } from "@/content/tiers";
const tier = tiers[2];
export const metadata: Metadata = { title: "Institutional", description: "Tier III: a dedicated inference cluster, bespoke topology, research access, governance telemetry and direct engineering synchronization." };
export default function InstitutionalPage() {
  return <>
    {/* Sources: content/tiers.ts Tier III. AWS/GCP is an existing tier fact. */}
    <DocHeader eyebrow={tier.tier} title={tier.name}><p>{tier.description} Tier III brings dedicated infrastructure, research access and governance telemetry into one qualified institutional engagement.</p></DocHeader>
    <DocSection title="Dedicated inference and structural scope">
      <EntryList entries={[
        { label: "Infrastructure", body: "The published configuration is a dedicated inference cluster on AWS/GCP. Deployment details are part of the institutional technical discussion; the public tier does not prescribe a region or capacity figure." },
        { label: "Bespoke topology", body: "Structural topology modeling is scoped to the institutional engagement. Direct engineering syncs provide the working channel for the integration and research discussion." },
        { label: "Research access", body: "The tier includes full access to whitepapers and ablation studies. These complement the public architecture summary with material for the institution’s research review." },
      ]} />
    </DocSection>
    {/* Sources: tiers III; partnerships ledgers; code audit sample. */}
    <DocSection title="Governance has an operational record">
      <Panel><Prose><p>Audit-grade telemetry logs are part of Tier III. Decision logs, state classifications and risk veto events can be exported in machine-readable formats for internal quantitative governance and review.</p><p>The <Link href="/delivery/audit-grade-ledgers">ledger guide</Link> shows how the approved example reads an export, identifies veto records and collects observed states. Export format and field names are confirmed during onboarding. “Audit-grade” describes the product’s telemetry role; it does not establish a regulatory certification.</p></Prose></Panel>
    </DocSection>
    {/* Sources: contact/engagements institutional; partnerships deployment; risk. */}
    <DocSection title="Define the engagement">
      <EntryList entries={[
        { label: "Scope and infrastructure", body: "Describe the institutional scope, infrastructure context and integration objectives. The application also asks for governance or telemetry objectives so these can be considered with the deployment." },
        { label: "Deployment review", body: "The enterprise process begins with an architecture sync, followed by a paper-trading parallel run. Live capital follows latency and slippage validation." },
        { label: "Capital responsibility", body: "Dedicated compute does not transfer custody or discretionary authority over API keys and capital sizing to ATRX. The tenant’s execution, counterparty and governance responsibilities remain." },
      ]} />
      <Actions><Link href={tier.apply} className="btn btn-primary">Apply for Institutional</Link><Link href="/access" className="btn btn-secondary">Compare tiers</Link></Actions>
    </DocSection>
    <DocSection title="Negotiated terms">
      <Prose><p>Institutional access is by application, with negotiated terms. Pricing is provided upon technical qualification; applications are evaluated against compute availability and infrastructure alignment.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }, { label: "Enterprise tenancy", href: "/partnerships" }, { label: "Risk disclosure", href: "/risk" }]} />
  </>;
}
