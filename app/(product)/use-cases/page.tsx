import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note, Prose, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "How hedge funds, asset managers, trading desks, risk teams, quantitative researchers and prosumers apply ATRX within their own controls.",
};

/*
 * Each audience restates documented ATRX scope and links to its source page:
 * the homepage, capability and control guides, Enterprise Tenancy, Quickstart and the tiers.
 * No section implies access, instrument availability or performance.
 */
export default function UseCasesPage() {
  return (
    <>
      <DocHeader title="Where ATRX fits in professional practice.">
        <p>
          ATRX is designed for systematic allocators, professional trading teams and enterprise desks that need to
          interpret complex market conditions together rather than in isolation. Each team below brings a different
          question and a different operating environment; in every case, decision and capital authority remain with
          the team.
        </p>
      </DocHeader>

      <DocSection id="hedge-funds" title="Hedge funds">
        <Prose>
          <p>
            Systematic and macro strategies need to know whether a structural opportunity holds under prevailing
            conditions before capital moves. ATRX evaluates the economic mechanism behind a market move, classifies the
            regime and delivers an execution payload that the fund’s environment verifies and passes through its own
            mandates before its risk engine.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Regime awareness", body: <>State gating restricts or permits execution according to prevailing market regimes, and the classification travels with the payload. See <Link href="/capabilities/regime-state-analysis">Regime &amp; State Analysis</Link>.</> },
            { label: "Attribution", body: <>Each payload carries a regime tag and a structural identifier, so realized P&amp;L can be attributed to the conditions it was taken in. See <Link href="/capabilities/causal-attribution">Causal Attribution</Link>.</> },
            { label: "Fund mandates", body: <>Drawdown thresholds, exposure limits and macroeconomic blackout windows are set by the desk. See <Link href="/control/native-risk-mandates">Native Risk Mandates</Link>.</> },
            { label: "Typical access", body: <><Link href="/access/capital-desk">Capital Desk</Link>: multi-node cohort allocation with custom regime gating and drawdown parameterization.</> },
          ]}
        />
      </DocSection>

      <DocSection id="asset-managers" title="Asset managers">
        <Prose>
          <p>
            An allocation decision depends on a judgment the institution can defend: the mechanism behind a move, where
            the thesis could fail and how it bears on the mandate. ATRX supports that research and keeps the evidence and
            reasoning available for review. It does not promise certainty or replace institutional decision-making
            authority.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Macro research", body: <>ATRX connects market-state observations to underlying economic drivers and evaluates whether a causal structure supports capital deployment. See <Link href="/capabilities/market-intelligence">Systemic Macro Intelligence</Link>.</> },
            { label: "Decision support", body: <>Prepared briefs set out their assumptions and evidence so they can be compared before the next review. See <Link href="/#practice">ATRX in practice</Link>.</> },
            { label: "Scope discipline", body: <>Phase 1 live-traded FX and Metals vectors are recorded separately from preparing and roadmap topology, so scope is never read as availability. See <Link href="/capabilities/market-coverage">Market Coverage</Link>.</> },
            { label: "Typical access", body: <><Link href="/access/capital-desk">Capital Desk</Link> for a desk allocation, or <Link href="/access/institutional">Institutional</Link> for a dedicated engagement with research access.</> },
          ]}
        />
      </DocSection>

      <DocSection id="trading-desks" title="Enterprise trading desks">
        <Prose>
          <p>
            ATRX integrates with enterprise trading desks as a parallel intelligence layer. Validated telemetry reaches
            the firm’s execution nodes through its existing infrastructure, so the desk keeps its venues, broker
            connections and controls.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Delivery", body: <>Signed, schema-validated execution payloads arrive in tenant infrastructure; verification parameters come through onboarding. See <Link href="/delivery/zero-latency-webhooks">Zero-Latency Webhooks</Link>.</> },
            { label: "Venues", body: <>Enterprise integration material describes translation to the venues and broker APIs the desk already uses. See <Link href="/partnerships#venues">Venue Independence</Link>.</> },
            { label: "Deployment", body: <>An architecture sync is followed by a paper-trading parallel run inside the tenant environment; live capital follows latency and slippage validation. See <Link href="/partnerships#deployment">Deployment Process</Link>.</> },
            { label: "Typical access", body: <><Link href="/access/capital-desk">Capital Desk</Link>: direct low-latency integration SDKs and priority latency routing.</> },
          ]}
        />
      </DocSection>

      <DocSection id="risk-governance" title="Risk & governance teams">
        <Prose>
          <p>
            Intelligence does not bypass control. ATRX subjects execution to regime eligibility and a mandatory risk
            handoff, the tenant retains authority over capital, sizing and instrument permissions, and the record of what
            was decided remains available for internal review.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Control", body: <>Regime eligibility and the risk veto are distinct checks; a structural opportunity does not override the mandatory risk-control handoff. See <Link href="/capabilities/risk-control">Risk &amp; Control</Link>.</> },
            { label: "Record", body: <>Decision logs, state classifications and risk veto events export in machine-readable formats for internal quantitative governance. “Audit-grade” describes the telemetry role, not a regulatory certification. See <Link href="/delivery/audit-grade-ledgers">Audit-Grade Ledgers</Link>.</> },
            { label: "Residual risk", body: <>Model and execution risk remain, including feed latency, broker API downtime and slippage. See the <Link href="/risk">Risk Disclosure</Link>.</> },
            { label: "Typical access", body: <><Link href="/access/institutional">Institutional</Link>: audit-grade telemetry logs for governance.</> },
          ]}
        />
      </DocSection>

      <DocSection id="quantitative-research" title="Quantitative researchers">
        <Prose>
          <p>
            Research teams build models, decision rules and research workflows on ATRX records in the language and
            framework the desk already uses, from point-in-time data to live directives, and judge outputs after the fact
            over a review window the desk sets.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Working with records", body: <>The homepage sets out how ATRX data, directives and evaluation fit a research workflow. See <Link href="/#workflow-modeling">Working with ATRX</Link>.</> },
            { label: "Integration walkthrough", body: <>Python and JavaScript examples cover receipt, verification, desk controls and routing of a payload. See <Link href="/quickstart">Quickstart</Link>.</> },
            { label: "Research material", body: <>Whitepapers and ablation studies are maintained for qualified evaluators and available through a <Link href="/contact?engagement=documentation#request">documentation request</Link>. The <Link href="/architecture">System Architecture</Link> summary is public.</> },
            { label: "Typical access", body: <><Link href="/access/institutional">Institutional</Link>: full access to whitepapers and ablation studies, with direct engineering syncs.</> },
          ]}
        />
      </DocSection>

      <DocSection id="prosumers" title="Quantitative prosumers">
        <Prose>
          <p>
            A qualified quantitative prosumer can run ATRX inside a single execution environment: a single-tenant pipeline
            whose receiving endpoint belongs to that environment, with the prosumer’s own mandates applied before the local
            risk engine.
          </p>
        </Prose>
        <EntryList
          entries={[
            { label: "Scope", body: <>The core FX and Metals topological vectors; MET_SAFE and FX_DM were live-traded during Phase 1 validation. See <Link href="/capabilities/market-coverage">Market Coverage</Link>.</> },
            { label: "Controls", body: <>Systemic guardrails are enforced at the API level, and capital decisions remain with the prosumer.</> },
            { label: "Delivery", body: <>A standard JSON webhook; verification parameters and schema details come through onboarding.</> },
            { label: "Typical access", body: <><Link href="/access/prosumer-node">Prosumer Node</Link>: monthly compute fee, by application.</> },
          ]}
        />
      </DocSection>

      <Note>
        Use cases describe how documented ATRX scope applies to each kind of team. They do not imply access, instrument
        availability or performance; access is granted by application after technical qualification.
      </Note>

      <Related
        links={[
          { label: "Explore access modes", href: "/explore" },
          { label: "Enterprise tenancy", href: "/partnerships" },
          { label: "Risk disclosure", href: "/risk" },
        ]}
      />
    </>
  );
}
