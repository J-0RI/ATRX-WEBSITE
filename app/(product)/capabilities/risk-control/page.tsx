import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Panel, Prose, Related } from "@/components/Doc";
import { ProductSteps } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Risk & Control", description: "ATRX execution eligibility, mandatory risk veto, desk mandates and retained tenant capital authority." };
export default function RiskControlPage() {
  return <>
    {/* Sources: architecture conditioning/control/pipeline; partnerships sovereignty. */}
    <DocHeader title="Risk & Control"><p>Intelligence does not bypass control. ATRX subjects execution to regime eligibility and a mandatory risk handoff, while the tenant retains authority over capital, sizing and instrument permissions.</p></DocHeader>
    <DocSection title="The control sequence">
      <ProductSteps steps={[
        { title: "Establish eligibility", body: "State gating restricts or permits execution according to prevailing market regimes. A structural interpretation alone is insufficient to authorize the handoff." },
        { title: "Enforce the veto", body: "The Control protocol has absolute veto power over mandated exposure and structural limits. A current state matching a known failure vector triggers the documented hard stop." },
        { title: "Respect desk limits", body: "Native mandates cover daily drawdown limits, exposure caps and macroeconomic blackout windows. Tenant-side integration applies desk mandates before routing directives." },
      ]} />
    </DocSection>
    {/* Sources: partnerships sovereignty; tiers I/II; content/code guardrails. */}
    <DocSection title="Separate system controls from capital authority">
      <Panel><EntryList entries={[
        { label: "Systemic guardrails", body: "Tier I includes guardrails enforced at the API level. Tier II adds custom regime gating and drawdown parameterization; the access configuration defines the published scope." },
        { label: "Desk authority", body: "The desk controls gross exposure, lot sizing scalars and instrument permissions. The mandate example uses desk-supplied limits rather than prescribing universal thresholds." },
        { label: "Operational evidence", body: "Decision logs, state classifications and risk veto events can be exported for internal quantitative governance. A blocked directive belongs in the review of control behavior, alongside executed outcomes." },
      ]} /></Panel>
    </DocSection>
    <DocSection title="Use mandates as the operational layer">
      <Prose><p>The <Link href="/control/native-risk-mandates">Native Risk Mandates</Link> guide shows an illustrative sequence: check blackout windows, evaluate desk limits and apply the desk’s sizing scalar. It explains one concrete mechanism within the broader control model.</p><p>The <Link href="/capabilities/regime-state-analysis">state-analysis guide</Link> covers market interpretation and gating. These concepts meet at execution eligibility, but classification and a desk-set capital limit serve different purposes.</p></Prose>
    </DocSection>
    {/* Source: risk disclosures algorithmic/counterparty/capacity. */}
    <DocSection title="Controls do not remove trading risk">
      <Prose><p>ATRX does not custody capital or guarantee capital preservation. Model misspecification, unexpected macroeconomic shocks, feed latency and execution friction remain possible. The tenant retains responsibility for its brokerage relationship and authority over API keys and capital sizing.</p><p>Read the <Link href="/risk">risk disclosure</Link> with the deployment material. Risk vetoes describe system behavior; they are not a guarantee against loss.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Native Risk Mandates", href: "/control/native-risk-mandates" }, { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }, { label: "Access Tiers", href: "/access" }]} />
  </>;
}
