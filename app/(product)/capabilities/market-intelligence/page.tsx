import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Panel, Prose, Related } from "@/components/Doc";
import { ProductSteps } from "@/components/ProductContent";
export const metadata: Metadata = { title: "Systemic Macro Intelligence", description: "How ATRX interprets market state and economic transmission to evaluate structural opportunities." };
export default function MarketIntelligencePage() {
  return <>
    {/* Sources: architecture perception/synthesis/projection; philosophy causal mandate. */}
    <DocHeader title="Systemic Macro Intelligence"><p>ATRX connects market-state observations to underlying economic drivers. The product evaluates whether a causal structure supports capital deployment, with execution subject to regime and risk controls.</p></DocHeader>
    <DocSection title="What the intelligence evaluates">
      <ProductSteps steps={[
        { title: "Market context", body: "Multidimensional market-state data and systemic economic variables provide the input context. The task is to interpret the environment in which an opportunity would operate." },
        { title: "Economic transmission", body: "Structural synthesis isolates underlying market drivers. The causal mandate requires an economic transmission mechanism behind execution, beyond historical co-movement." },
        { title: "Structural viability", body: "Inference routing evaluates the viability of the structure and informs capital deployment. A broken causal baseline prevents the strategy from proceeding to execution." },
      ]} />
    </DocSection>
    {/* Sources: architecture conditioning/control; partnerships attribution/sovereignty. */}
    <DocSection title="An interpretation is subject to control">
      <Panel><Prose><p>Structural reasoning is one part of the decision. <Link href="/capabilities/regime-state-analysis">Regime &amp; State Analysis</Link> determines whether prevailing conditions permit execution. The Control protocol retains veto power over mandated exposure and structural limits.</p><p>The result reaches the tenant as an execution payload with a regime tag and structural identifier. Those identifiers give the desk context for relating realized P&amp;L to macroeconomic catalysts and volatility states; they do not transfer capital authority away from the desk.</p></Prose></Panel>
    </DocSection>
    {/* Sources: philosophy alpha-decay/self-correcting; architecture adaptation; instruments exact statuses. */}
    <DocSection title="Changing structure, recorded outcomes">
      <EntryList entries={[
        { label: "Adaptation", body: "The published product philosophy describes mapping new causal chains as market structure changes. Closed-loop telemetry logs localized failures into structural memory for the decision stack." },
        { label: "Coverage", body: <>The same causal framing extends across the instrument topology, but deployment status is specific to each vector. The current record distinguishes Phase 1 live-traded FX and Metals from preparing and roadmap vectors. <Link href="/capabilities/market-coverage">Review coverage and status.</Link></> },
        { label: "Interpretation limits", body: "Formal causal reasoning does not remove model misspecification, unexpected macroeconomic shocks or data-feed latency. These remain explicit risks of the system." },
      ]} />
    </DocSection>
    <Related links={[{ label: "Regime & State Analysis", href: "/capabilities/regime-state-analysis" }, { label: "Causal Attribution", href: "/capabilities/causal-attribution" }, { label: "Structural philosophy", href: "/philosophy" }, { label: "System architecture", href: "/architecture" }]} />
  </>;
}
