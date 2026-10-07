import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Panel, Prose, Related } from "@/components/Doc";
import { ProductExample } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Audit-Grade Ledgers", description: "Machine-readable ATRX decision logs, state classifications and risk veto events for internal quantitative governance." };
export default function AuditLedgersPage() {
  return <>
    {/* Sources: partnerships ledgers; content/code.ts audit; tiers III. */}
    <DocHeader title="Audit-Grade Ledgers"><p>ATRX exports decision logs, state classifications and risk veto events in machine-readable formats. The record supports internal quantitative governance and review, including decisions that did not become executions.</p></DocHeader>
    <DocSection title="What the record makes available">
      <EntryList entries={[
        { label: "Decision logs", body: "Provide a record for reviewing the decision process. The published export example reads decision records from a ledger supplied to the tenant." },
        { label: "State classifications", body: "Preserve classified market-state context. The example collects the distinct states observed in the export for subsequent review." },
        { label: "Risk veto events", body: "Identify recorded control vetoes. The example filters these events and counts them alongside the broader decision set." },
      ]} />
    </DocSection>
    <DocSection title="Inspect a ledger export">
      <ProductExample category="audit" label="Ledger review example language" />
    </DocSection>
    {/* Sources: existing audit example; architecture adaptation; philosophy structural ledger. */}
    <DocSection title="Use telemetry at two levels">
      <Panel><EntryList entries={[
        { label: "Tenant review", body: "The sample reads a JSON export, counts records and vetoes, and lists observed states. Its filename and fields illustrate the workflow; export format and field names are confirmed during onboarding." },
        { label: "Structural feedback", body: "The architecture’s closed-loop telemetry generates signed logs and records localized failures in structural memory. This system feedback role complements the tenant’s governance review." },
        { label: "Attribution", body: <>For realized results, <Link href="/capabilities/causal-attribution">Causal Attribution</Link> groups P&amp;L by the regime tag and structural identifier carried in each execution payload. Ledger review includes a broader decision and veto context.</> },
      ]} /></Panel>
    </DocSection>
    <DocSection title="Governance scope">
      <Prose><p>The Institutional access tier explicitly includes audit-grade telemetry logs for governance, alongside research access and direct engineering syncs. Institutional applications can describe their governance and telemetry objectives as part of the requested deployment.</p><p>“Audit-grade” names the product’s record and review capability. The published material does not assert regulatory certification, a retention period, a particular export schedule or a storage guarantee. Use the confirmed onboarding details when integrating exports into internal review.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Institutional access", href: "/access/institutional" }, { label: "Causal Attribution", href: "/capabilities/causal-attribution" }, { label: "Native Risk Mandates", href: "/control/native-risk-mandates" }, { label: "Zero-Latency Webhooks", href: "/delivery/zero-latency-webhooks" }]} />
  </>;
}
