import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList, Note, Panel, Prose, Related } from "@/components/Doc";
import { tiers } from "@/content/tiers";
const tier = tiers[0];
export const metadata: Metadata = { title: "Prosumer Node", description: "Tier I: a single-tenant ATRX execution pipeline, core FX and Metals vectors, API-level guardrails and JSON webhook delivery." };
export default function ProsumerNodePage() {
  return <>
    {/* Sources: content/tiers.ts Tier I; access qualification. */}
    <DocHeader eyebrow={tier.tier} title={tier.name}><p>{tier.description} Tier I pairs the core FX and Metals topological vectors with standard JSON webhook delivery for a qualified quantitative prosumer.</p></DocHeader>
    <DocSection title="The node’s scope">
      <Panel><EntryList entries={[
        { label: "Deployment", body: "A single-tenant execution pipeline is the Tier I access configuration. The receiving endpoint belongs to your execution environment." },
        { label: "Market context", body: <>The core scope is FX and Metals. The instrument record identifies MET_SAFE and FX_DM as live-traded vectors executed during Phase 1 validation. See <Link href="/capabilities/market-coverage">Market Coverage</Link> for the distinction between validated, preparing and roadmap vectors.</> },
        { label: "Controls and delivery", body: "Systemic guardrails are enforced at the API level. Execution payloads arrive through a standard JSON webhook; verification parameters and schema details come through onboarding." },
      ]} /></Panel>
    </DocSection>
    {/* Sources: content/code.ts webhook/guardrails; risk capacity/counterparty. */}
    <DocSection title="Place the node inside your workflow">
      <Prose><p>The tenant-side integration begins by verifying the incoming payload. The approved example then applies desk mandates and passes the resulting directive to the local risk engine. The <Link href="/quickstart">Quickstart</Link> provides Python and JavaScript versions of that handoff.</p><p>Keep the system guardrails and your capital decisions distinct. ATRX supplies intelligence and execution payloads; the tenant retains authority over API keys and deployment sizing. Model and execution risk remain, including feed latency, broker API downtime and slippage.</p></Prose>
    </DocSection>
    {/* Source: contact/engagements.ts prosumer fields; tiers/access. */}
    <DocSection title="Prepare the application">
      <EntryList entries={[
        { label: "Deployment objective", body: "Describe what you want the node to support, your markets of interest and the execution or research environment in which it would operate." },
        { label: "Operating constraints", body: "Include the constraints relevant to your deployment. This gives technical qualification context for the requested single-tenant configuration." },
        { label: "Commercial basis", body: "Monthly compute fee, by application. Pricing is provided upon technical qualification; access is evaluated against available compute capacity and infrastructure alignment." },
      ]} />
      <Actions><Link href={tier.apply} className="btn btn-primary">Apply for Prosumer Node</Link><Link href="/access" className="btn btn-secondary">Compare tiers</Link></Actions>
      <Note>Markets named in an application are interests for review, not confirmation of availability.</Note>
    </DocSection>
    <Related links={[{ label: "Native Risk Mandates", href: "/control/native-risk-mandates" }, { label: "Zero-Latency Webhooks", href: "/delivery/zero-latency-webhooks" }, { label: "Risk disclosure", href: "/risk" }]} />
  </>;
}
