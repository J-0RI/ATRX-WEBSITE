import type { Metadata } from "next";
import { DocHeader, DocSection, EntryList, Prose, Related } from "@/components/Doc";

export const metadata: Metadata = {
  title: "System Architecture",
  description: "ATRX v4.0: seven structural pillars, a five-stage inference pipeline, and one absolute veto.",
};

const pillars = [
  {
    id: "perception",
    label: "01 · Perception",
    title: "Data Ingestion",
    body: "Continuous aggregation of multidimensional market state data and systemic economic variables.",
  },
  {
    id: "synthesis",
    label: "02 · Synthesis",
    title: "Structural Topology",
    body: "A multi-node processing matrix that isolates underlying market drivers without relying on standard historical correlation.",
  },
  {
    id: "projection",
    label: "03 · Projection",
    title: "Inference Routing",
    body: "A dynamic routing layer that evaluates structural viability and determines optimal capital deployment.",
  },
  {
    id: "conditioning",
    label: "04 · Conditioning",
    title: "State Gating",
    body: "A multidimensional estimation model that dynamically restricts or permits execution based on prevailing market regimes.",
  },
  {
    id: "control",
    label: "05 · Control",
    title: "Capital Protection",
    body: "A strict systemic risk protocol that enforces absolute veto power to maintain mandated exposure and structural limits.",
  },
  {
    id: "execution",
    label: "06 · Execution",
    title: "Latency Terminal",
    body: "Venue-independent protocol adapters translating internal intelligence directives into secure, low-latency market execution.",
  },
  {
    id: "adaptation",
    label: "07 · Adaptation",
    title: "Telemetry Loop",
    body: "Every closed loop generates a signed log, embedding localized failures back into the system's structural memory.",
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <DocHeader eyebrow="Whitepaper summary · v4.0" title="Seven pillars. Five stages. One absolute veto.">
        <p>
          ATRX v4.0 is organized across seven infrastructural pillars, executed through a
          deterministic five-stage pipeline, linked to tenant environments via zero-latency
          webhooks, and refined continuously by a telemetry memory loop. The summary below outlines
          the computational topology without exposing the proprietary node weights.
        </p>
      </DocHeader>

      <DocSection id="pillars" title="The structural pillars">
        <EntryList entries={pillars} />
      </DocSection>

      <DocSection id="pipeline" title="Inference pipeline">
        <Prose>
          <p>
            Data flows linearly through <strong>Perception</strong>, <strong>Synthesis</strong>,{" "}
            <strong>Conditioning</strong>, and <strong>Control</strong> before reaching{" "}
            <strong>Execution</strong>. The Control layer receives a mandatory handoff. If the
            current market state matches a known failure vector, the protocol enforces a hard stop.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="transport" title="Transport layer">
        <Prose>
          <p>
            Subscribers map a local endpoint that receives a schema-validated JSON payload from the
            ATRX intelligence cloud. Execution directives are sub-second, replay-protected, and
            require zero user credentials to leave the tenant environment.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="footprint" title="Engineering footprint">
        <Prose>
          <p>
            The architecture is built end-to-end using natively compiled runtime environments and
            highly optimized compute frameworks. From the core computational graph to compiled
            runtime telemetry, the entire stack is developed in-house. It is driven by our
            internally developed and engineered model, never an AI slogan.
          </p>
          <p>
            Currently in active R&amp;D: we are advancing our systemic architecture to extend beyond
            trade execution, developing autonomous portfolio management frameworks capable of
            dynamic, multi-strategy capital allocation.
          </p>
        </Prose>
      </DocSection>

      <Related
        links={[
          { label: "Enterprise tenancy", href: "/partnerships" },
          { label: "Instrument topology", href: "/instruments" },
          { label: "Structural philosophy", href: "/philosophy" },
          { label: "Request the technical whitepaper", href: "/contact?engagement=documentation#request" },
        ]}
      />
    </>
  );
}
