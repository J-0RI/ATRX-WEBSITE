import type { Metadata } from "next";
import { DocHeader, DocSection, Prose, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Structural Philosophy",
  description: "Alpha decay, causal reflexivity, and the self-compiling network.",
};

export default function PhilosophyPage() {
  return (
    <>
      <DocHeader eyebrow="Philosophy · Essay · 2026" title="ATRX is a self-compiling organism.">
        <p>
          ATRX exists for a reason that is simple to state and brutally difficult to execute.
          Institutional-grade quantitative trading has historically been monopolized by funds with
          billions in infrastructure capital. The core thesis of ATRX is that the exact same
          mathematical rigor, causal reasoning, and low-latency infrastructure can be completely
          decentralized. Not diluted. Decentralized.
        </p>
        <p>
          That is the definitive purpose of this engine. ATRX delivers high-frequency causal
          infrastructure to systematic allocators, professional nodes, and enterprise desks. What
          was once locked behind closed corporate vaults is now delivered seamlessly via cloud
          compute and API distribution.
        </p>
      </DocHeader>

      <DocSection id="self-correcting" title="A living, self-correcting network">
        <Prose>
          <p>
            ATRX is not a static algorithmic script. It behaves as a living organism in a high-noise
            environment. The platform breathes through closed-loop telemetry. Execution failures are
            not ignored; they are explicitly logged into a structural ledger. The decision stack
            metabolizes these failures, ensuring the system can never repeat a contextual mistake.
            It is an architecture that structurally immunizes itself against market decay.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="causal-mandate" title="The Causal Mandate">
        <Prose>
          <p>
            The platform operates on an unyielding principle: correlation is a trap. Standard models
            fail during regime shifts because they trade historical co-movement. ATRX enforces a
            Causal Transmission Architecture. Every execution must be mapped to a physical economic
            transmission mechanism. No strategy, however compelling its historical backtest, is
            permitted to execute if the underlying causal baseline is broken.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="alpha-decay" title="The fight against alpha decay">
        <Prose>
          <p>
            Alpha is highly radioactive. The moment an edge is discovered, it begins to decay.
            Legacy systems combat this by throwing analysts at the problem. ATRX combats this via
            autonomous structural adaptation. Our perception models dynamically map new causal
            chains, and our dynamic routing layer reallocates capital on the fly.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="structural-physics" title="Innovation as structural physics">
        <Prose>
          <p>
            The next frontier of quantitative finance will be defined by systems that treat AI as a
            deterministic computational graph, not a chatbot. ATRX is built to this exact standard.
            The synthesis topologies and regime gates are engineered for maximum auditability and
            mathematical accountability.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="why" title="Why ATRX exists">
        <Prose>
          <p>
            ATRX exists to prove that world-class quantitative infrastructure can operate outside
            the traditional fund complex. That novelty, extreme rigor, and decentralized access can
            occupy the same architecture. Designed to dismantle the access gap. Aimed directly at
            the future of systematic capital.
          </p>
        </Prose>
      </DocSection>

      <Related
        links={[
          { label: "System architecture", href: "/architecture" },
          { label: "Phase 1 performance", href: "/performance" },
          { label: "Founder", href: "/founder" },
        ]}
      />
    </>
  );
}
