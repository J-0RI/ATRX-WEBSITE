import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";
import { ProductExample, ProductSteps } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Zero-Latency Webhooks", description: "Signed, schema-validated ATRX execution payloads delivered into tenant infrastructure, with onboarding-supplied verification details." };
export default function WebhooksPage() {
  return <>
    {/* Sources: partnerships webhooks; architecture transport; code webhooks. */}
    <DocHeader title="Zero-Latency Webhooks"><p>The ATRX intelligence cloud streams signed, schema-validated execution payloads directly to tenant server infrastructure. The local integration connects those directives to the desk’s existing execution environment.</p></DocHeader>
    <Note>“Zero-Latency Webhooks” is the existing product name. It does not mean zero measured delivery time or establish a numeric latency guarantee.</Note>
    <DocSection title="The delivery boundary">
      <EntryList entries={[
        { label: "Tenant endpoint", body: "Subscribers map a local endpoint to receive JSON payloads from the intelligence cloud. API credentials remain inside the tenant environment." },
        { label: "Payload integrity", body: "The published delivery model describes signed, schema-validated payloads and replay-protected directives. Verification parameters and the payload schema are supplied during onboarding." },
        { label: "Access configuration", body: "Prosumer Node includes standard JSON webhook delivery. Capital Desk includes direct low-latency integration SDKs and priority latency routing; the public material does not specify a package name or numeric SLA." },
      ]} />
    </DocSection>
    <DocSection title="Receive a directive in your environment">
      <ProductExample category="webhooks" label="Webhook example language" />
    </DocSection>
    {/* Source: existing webhook sample exact sequence. */}
    <DocSection title="Read the integration sequence">
      <ProductSteps steps={[
        { title: "Verify", body: "The sample checks the signature and rejects a request that fails verification. The helper stands in for the onboarding-defined implementation." },
        { title: "Retain", body: "The received payload is appended to the tenant’s ledger for its own audit review. This sample operation does not define a storage or retention policy." },
        { title: "Constrain and route", body: "Desk mandates are applied before the local risk engine receives the directive. The desk keeps capital sizing and instrument permissions within its environment." },
      ]} />
      <Note>The abbreviated handler does not implement schema validation or replay protection. Their presence in the delivery model must not be confused with complete verification code in this illustration.</Note>
    </DocSection>
    {/* Sources: partnerships venues/deployment; risk counterparty. */}
    <DocSection title="Validate the downstream connection">
      <Prose><p>Enterprise integration material describes SDK translation to existing venues and broker APIs. Deployment begins with an architecture sync, proceeds to paper trading inside the tenant environment and moves to live capital after latency and slippage validation.</p><p>Delivery does not remove broker API downtime, spread widening or slippage. Keep the execution boundary and <Link href="/risk">risk disclosure</Link> in view when connecting the payload to capital.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Quickstart", href: "/quickstart" }, { label: "Native Risk Mandates", href: "/control/native-risk-mandates" }, { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }]} />
  </>;
}
