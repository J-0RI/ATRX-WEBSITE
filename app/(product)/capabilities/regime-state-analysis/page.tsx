import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";
import { ProductSteps } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Regime & State Analysis", description: "Market-state interpretation, execution gating and the classifications carried into ATRX payloads and telemetry." };
export default function RegimeStatePage() {
  return <>
    {/* Sources: architecture perception/conditioning/control and pipeline. */}
    <DocHeader title="Regime & State Analysis"><p>Market conditions affect whether a structural opportunity may proceed. ATRX’s state-gating layer dynamically restricts or permits execution according to prevailing market regimes.</p></DocHeader>
    <DocSection title="From observed state to execution eligibility">
      <ProductSteps steps={[
        { title: "Observe conditions", body: "Market-state data and systemic economic variables enter the intelligence process. Structural synthesis supplies context for interpreting the environment." },
        { title: "Gate the directive", body: "Conditioning evaluates the prevailing regime and can restrict execution. Permission at this stage still leads to a mandatory Control handoff." },
        { title: "Apply the veto", body: "Control enforces exposure and structural limits. The documented pipeline imposes a hard stop when the current state matches a known failure vector." },
      ]} />
    </DocSection>
    {/* Sources: partnerships mandates/attribution/ledgers; tiers II. */}
    <DocSection title="Keep classifications and mandates distinct">
      <EntryList entries={[
        { label: "Regime classification", body: "A regime tag travels with every execution payload. Alongside the structural identifier, it supplies context for attribution to macroeconomic catalysts and volatility states." },
        { label: "Desk conditions", body: <>Daily drawdown limits, exposure caps and macroeconomic blackout windows are desk mandates. They constrain execution even when a market interpretation is available. See <Link href="/control/native-risk-mandates">Native Risk Mandates</Link> for the operational example.</> },
        { label: "Tier II configuration", body: "Capital Desk includes custom regime gating and drawdown parameterization. This is a published tier distinction, not a promise that every access mode exposes the same configuration." },
      ]} />
    </DocSection>
    <DocSection title="Review the state behind an outcome">
      <Prose><p>Attribution groups realized results using the regime and structural context carried by the payload. Ledger exports provide state classifications and risk veto events for internal quantitative review, including decisions that did not proceed to execution.</p><p>The public material explains these relationships without publishing regime labels, proprietary node weights or classification thresholds. Use onboarding-supplied schemas when integrating the recorded context into your own review process.</p></Prose>
      <Note>State gating does not eliminate model or market risk. The risk disclosure identifies regime decay, macroeconomic shocks and execution friction as continuing limitations.</Note>
    </DocSection>
    <Related links={[{ label: "Systemic Macro Intelligence", href: "/capabilities/market-intelligence" }, { label: "Causal Attribution", href: "/capabilities/causal-attribution" }, { label: "Risk & Control", href: "/capabilities/risk-control" }, { label: "Audit-Grade Ledgers", href: "/delivery/audit-grade-ledgers" }]} />
  </>;
}
