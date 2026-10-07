import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Prose, Related } from "@/components/Doc";
import { ProductExample } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Causal Attribution", description: "Relate realized P&L to the regime tags and structural identifiers carried by ATRX execution payloads." };
export default function CausalAttributionPage() {
  return <>
    {/* Sources: partnerships attribution; content/code.ts attribution category. */}
    <DocHeader title="Causal Attribution"><p>Every execution payload carries a regime tag and a structural identifier. These give desks a way to attribute realized P&amp;L back to the macroeconomic catalysts and volatility states associated with execution.</p></DocHeader>
    <DocSection title="The context carried with a decision">
      <EntryList entries={[
        { label: "Regime tag", body: "Preserves the regime context attached to the execution payload. The attribution example uses it as one dimension when grouping realized results." },
        { label: "Structural identifier", body: "Identifies the structural context carried by the same payload. The example combines it with the regime tag rather than reducing all fills to one aggregate result." },
        { label: "Realized P&L", body: "The desk’s fill records supply realized P&L. The tenant-side example accumulates those values for each regime-and-structure pair over a selected period." },
      ]} />
    </DocSection>
    <DocSection title="Group results by their execution context">
      <ProductExample category="attribution" label="Attribution example language" />
    </DocSection>
    {/* Sources: code attribution exact behavior; partnerships ledgers; architecture adaptation. */}
    <DocSection title="Read the result with its limits">
      <Prose><p>The example groups fills for a month and prints the resulting totals. The period is an example query, not a reporting cadence or a claim about returns. Field names and the payload schema remain onboarding details.</p><p>This is a way to organize observed P&amp;L using the context attached to decisions. It does not publish a new causal-estimation methodology or establish that a grouped result alone proves causation.</p><p>For the wider decision record, use <Link href="/delivery/audit-grade-ledgers">Audit-Grade Ledgers</Link>. Those exports include state classifications and risk veto events as well as decision logs, supporting review beyond filled executions.</p></Prose>
    </DocSection>
    <DocSection title="Connect reasoning and review">
      <Prose><p>Market Intelligence describes the economic-transmission requirement behind execution. Regime &amp; State Analysis describes the gate that responds to conditions. Attribution makes their recorded context useful to the desk when examining realized outcomes, while the telemetry loop records localized failures in structural memory.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Regime & State Analysis", href: "/capabilities/regime-state-analysis" }, { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }, { label: "Systemic Macro Intelligence", href: "/capabilities/market-intelligence" }]} />
  </>;
}
