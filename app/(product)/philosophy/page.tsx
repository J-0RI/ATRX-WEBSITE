import type { Metadata } from "next";
import { DocHeader, DocSection, Prose, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Structural Philosophy",
  description: "Why ATRX requires an economic transmission mechanism rather than historical correlation, and how it responds to alpha decay.",
};

export default function PhilosophyPage() {
  return (
    <>
      <DocHeader title="Market structure, not historical correlation.">
        <p>
          Rigorous quantitative research and execution infrastructure has largely been available only
          to firms able to fund it internally. ATRX is built on the premise that the same causal
          methodology, risk discipline and low-latency delivery can be provided to qualified
          allocators and desks as shared infrastructure, without lowering the standard.
        </p>
        <p>
          ATRX delivers causal market intelligence and execution infrastructure to systematic
          allocators, independent quantitative traders and enterprise desks. It reaches them through
          cloud compute and API distribution, inside the research, risk and execution environments
          they already operate.
        </p>
      </DocHeader>

      <DocSection id="self-correcting" title="Learning from recorded failures">
        <Prose>
          <p>
            ATRX is designed to adapt as the markets it models change. Closed-loop telemetry records
            each execution outcome, and localized failures are logged to a structural ledger that
            informs the decision stack. When the current market state matches a known failure vector,
            the Control protocol enforces a hard stop. The objective is to reduce repeated contextual
            errors as market structure shifts, not to claim immunity from them.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="causal-mandate" title="The Causal Mandate">
        <Prose>
          <p>
            ATRX treats historical correlation as insufficient evidence. Models that rely on
            co-movement tend to fail at regime shifts, when the relationships they were fitted to
            break down. Under the Causal Transmission Architecture, every execution must be mapped to
            an economic transmission mechanism. A strategy does not proceed to execution if its causal
            baseline is broken, however strong its historical backtest.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="alpha-decay" title="Responding to alpha decay">
        <Prose>
          <p>
            An edge begins to decay once it is identified and traded. Many firms respond by adding
            research capacity. ATRX responds through structural adaptation: perception models map new
            causal chains as market structure changes, and the inference routing layer reassesses
            capital deployment as those structures shift.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="structural-physics" title="Accountable model design">
        <Prose>
          <p>
            ATRX models are built as a deterministic computational graph whose decisions can be traced
            and examined, rather than as an opaque predictive system. Synthesis topologies and regime
            gates are designed for auditability: decision logs, state classifications and risk veto
            events are recorded for review.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="why" title="Why ATRX exists">
        <Prose>
          <p>
            ATRX is intended to show that institutional-standard quantitative infrastructure can
            operate outside the traditional fund structure, and that broader access need not come at
            the expense of methodological rigor or risk discipline.
          </p>
        </Prose>
      </DocSection>

      <Related
        links={[
          { label: "System architecture", href: "/architecture" },
          { label: "Phase 1 performance", href: "/performance" },
        ]}
      />
    </>
  );
}
