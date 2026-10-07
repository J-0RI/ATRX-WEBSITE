import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";
import { ProductExample, ProductSteps } from "@/components/ProductContent";
import { heroSamples } from "@/content/code";

export const metadata: Metadata = { title: "Quickstart", description: "A tenant-side ATRX integration walkthrough using the approved Python, JavaScript and illustrative payload examples." };

export default function QuickstartPage() {
  return <>
    {/* Sources: access qualification; content/code.ts sample contract boundaries. */}
    <DocHeader title="Connect intelligence to your execution environment."><p>Begin with technical qualification, then work through receipt, verification, desk controls and routing. The examples below describe the integration pattern; your onboarding supplies the parameters needed to implement it.</p></DocHeader>
    <DocSection title="Before connecting">
      <EntryList entries={[
        { label: "Qualify the deployment", body: <>Compare the <Link href="/access">access tiers</Link> and describe your execution environment and constraints in the application. ATRX operates in a closed deployment phase; pricing follows technical qualification.</> },
        { label: "Receive the integration details", body: "Verification parameters and the payload schema are issued during onboarding. The public examples do not define an API host, signature algorithm, header names or an installable SDK package." },
        { label: "Keep capital controls local", body: "Map the receiving endpoint in your own environment. Your desk controls gross exposure, sizing and instrument permissions, and retains its API credentials." },
      ]} />
    </DocSection>
    <DocSection title="Receive, verify and route">
      <ProductExample samples={heroSamples} label="Quickstart example language" />
    </DocSection>
    {/* Sources: heroSamples and webhooks/guardrails categories. */}
    <DocSection title="Follow the handoff">
      <ProductSteps steps={[
        { title: "Verify receipt", body: "The example rejects a request when signature verification fails. Implement verification using the onboarding-supplied parameters; the helper name does not specify the underlying scheme." },
        { title: "Apply mandates", body: "Pass the payload through desk controls before routing. The mandate examples show blackout windows, drawdown and exposure limits, followed by desk-set sizing." },
        { title: "Route and retain", body: "Route the resulting directive through your existing risk engine. The webhook walkthrough also retains the received payload for the desk’s own audit review." },
      ]} />
      <Note>The payload tab is an illustration, not a schema contract. The abbreviated handler does not implement the full validation or replay-protection mechanism.</Note>
    </DocSection>
    {/* Source: partnerships deployment process; audit/attribution examples. */}
    <DocSection title="Validate the enterprise connection">
      <Prose><p>Enterprise engagements begin with a technical architecture sync and proceed to a paper-trading parallel run inside the tenant environment. Conversion to live capital follows latency and slippage validation.</p><p>During review, use the payload’s regime and structural context for attribution, and inspect exported decisions, state classifications and veto events. The delivery and telemetry guides expand these patterns without introducing a separate API contract.</p></Prose>
    </DocSection>
    <Related links={[{ label: "Webhook receipt examples", href: "/delivery/zero-latency-webhooks" }, { label: "Implement desk mandates", href: "/control/native-risk-mandates" }, { label: "Review exported telemetry", href: "/delivery/audit-grade-ledgers" }, { label: "Attribute realized P&L", href: "/capabilities/causal-attribution" }]} />
  </>;
}
