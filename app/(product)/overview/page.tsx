import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList, Panel, Prose, Related } from "@/components/Doc";
import { ProductSteps } from "@/components/ProductContent";
import { tiers } from "@/content/tiers";

export const metadata: Metadata = { title: "Product Overview", description: "The ATRX operating model: systemic macro intelligence, native controls and delivery into tenant infrastructure." };

export default function ProductOverviewPage() {
  return <>
    {/* Sources: homepage product description; philosophy introduction; partnerships introduction. */}
    <DocHeader title="Intelligence, controls and execution. One product system.">
      <p>ATRX is quantitative infrastructure for systematic allocators, professional nodes and enterprise desks. It combines systemic macro intelligence with risk controls and execution delivery inside the tenant’s existing environment.</p>
    </DocHeader>
    <DocSection title="From market conditions to a controlled directive">
      <ProductSteps steps={[
        { title: "Interpret", body: "Market-state data and systemic economic variables inform structural reasoning. ATRX evaluates the economic drivers behind a potential deployment, rather than relying on historical co-movement alone." },
        { title: "Constrain", body: "Regime gating restricts or permits execution as conditions change. A mandatory Control handoff can veto a directive against exposure and structural limits." },
        { title: "Deliver", body: "Signed, schema-validated payloads reach tenant infrastructure. Local integration applies desk mandates and routes directives through the desk’s execution environment." },
      ]} />
    </DocSection>
    {/* Sources: partnerships sovereignty/webhooks/ledgers; architecture adaptation; risk capacity/counterparty. */}
    <DocSection title="A clear operating boundary">
      <Panel><EntryList entries={[
        { label: "ATRX intelligence", body: "Structural inference, market-state classification and the systemic control protocol shape execution directives. Decision logs, state classifications and veto events support subsequent review." },
        { label: "Tenant authority", body: "Your desk retains control of gross exposure, lot sizing and instrument permissions. API credentials remain in the tenant environment; ATRX does not custody capital." },
        { label: "Feedback and review", body: "Closed-loop telemetry records execution outcomes and localized failures in structural memory. Attribution connects realized results with the regime and structural identifiers carried by a payload." },
      ]} /></Panel>
    </DocSection>
    <DocSection title="Choose the deployment scope">
      <EntryList entries={tiers.map((tier) => ({ label: tier.name, title: tier.tier, body: <><p>{tier.description}</p><Link href={`/access/${tier.id}`}>Explore {tier.name}</Link></> }))} />
      <Actions><Link href="/access" className="btn btn-secondary">Compare access tiers</Link><Link href="/quickstart" className="btn btn-primary">Start the technical walkthrough</Link></Actions>
    </DocSection>
    <DocSection title="Read the product in context">
      <Prose><p>Market Intelligence explains the causal reasoning behind the product. Regime &amp; State Analysis explains how conditions affect execution eligibility. Risk &amp; Control and Native Risk Mandates describe the system and desk constraints, while Webhooks and Ledgers cover delivery and review.</p><p>Access remains a closed, qualified deployment process. Product controls do not remove model, market or execution risk; the <Link href="/risk">risk disclosure</Link> applies across tenant environments.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Systemic Macro Intelligence", href: "/capabilities/market-intelligence" }, { label: "Risk & Control", href: "/capabilities/risk-control" }, { label: "Zero-Latency Webhooks", href: "/delivery/zero-latency-webhooks" }]} />
  </>;
}
