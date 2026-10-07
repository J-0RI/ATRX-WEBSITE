import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Prose, Related } from "@/components/Doc";
import { ProductExample } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Native Risk Mandates", description: "Desk-set drawdown thresholds, exposure limits and macroeconomic blackout windows in the ATRX execution workflow." };
export default function NativeRiskMandatesPage() {
  return <>
    {/* Sources: partnerships risk-mandates/sovereignty; content/code.ts guardrails. */}
    <DocHeader title="Native Risk Mandates"><p>The execution node respects daily drawdown limits, exposure caps and macroeconomic blackout windows. Your desk sets the operating constraints; mandates apply them within the execution workflow.</p></DocHeader>
    <DocSection title="Express the desk’s boundaries">
      <EntryList entries={[
        { label: "Drawdown thresholds", body: "Daily drawdown limits form part of the desk mandate. The approved example reads the limit from the desk’s own configuration rather than publishing a default percentage." },
        { label: "Exposure limits", body: "An exposure cap constrains deployment. Gross exposure and lot sizing remain under desk control; the example applies a desk-set sizing scalar after its checks." },
        { label: "Blackout windows", body: "Macroeconomic blackout windows are checked before the example evaluates mandate limits. A request inside a window returns a veto instead of proceeding to sizing." },
        { label: "Instrument permissions", body: "The desk retains instrument permissions. The illustrative mandate includes MET_SAFE and FX_DM; the example is not a complete tenant configuration or an availability contract." },
      ]} />
    </DocSection>
    <DocSection title="Apply policy before routing">
      <ProductExample category="guardrails" label="Risk mandate example language" />
    </DocSection>
    {/* Sources: code guardrails behavior; tiers I/II; architecture control. */}
    <DocSection title="Interpret the example">
      <Prose><p>The pattern checks for a macro blackout first, then delegates limit evaluation to the illustrative <code>breaches</code> helper. A failed check returns a veto; otherwise the payload passes to sizing with the desk’s lot scalar. Helper behavior and field names are deliberately abstract.</p><p>This tenant-side pattern complements ATRX’s systemic Control protocol, which retains veto power over exposure and structural limits. Tier I includes API-level systemic guardrails; Tier II adds custom regime gating and drawdown parameterization.</p></Prose>
    </DocSection>
    {/* Sources: partnerships ledgers; risk capacity. */}
    <DocSection title="Review enforcement, including vetoes">
      <Prose><p>Exported risk veto events, state classifications and decision logs provide material for internal quantitative review. The <Link href="/delivery/audit-grade-ledgers">ledger examples</Link> show one way to inspect the recorded vetoes and observed states.</p><p>Policy enforcement is an operational capability, not a regulatory certification or a guarantee of capital preservation. Read it alongside the broader <Link href="/capabilities/risk-control">Risk &amp; Control</Link> framework and the existing risk disclosure.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Risk & Control", href: "/capabilities/risk-control" }, { label: "Regime & State Analysis", href: "/capabilities/regime-state-analysis" }, { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }]} />
  </>;
}
