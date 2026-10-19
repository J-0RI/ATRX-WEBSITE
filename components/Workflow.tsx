import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./Workflow.module.css";

/*
 * Homepage chapter 4 — how a desk works with ATRX (decision-20261018-workflow-chapter).
 * Four stages of one operating cycle: data → modeling → live directives → evaluation.
 * Every statement is grounded in published ATRX material: Perception / Synthesis /
 * Conditioning / Control pipeline, signed schema-validated payloads carrying a regime tag and
 * structural identifier, tenant-side integration, desk mandates, Causal Attribution and
 * Audit-Grade Ledger exports. No public schema, field contract, cadence or metric is implied.
 *
 * Every stage carries an original editorial illustration from one family, 'Records in material'
 * (decision-20261018-records-in-material): a cyanotype exposure, suminagashi marbling, silk
 * threads gathered through a brass ring, and a wood cross-section. The copy carries the
 * explanation; the art carries the tone. Painted procedurally.
 */

type Detail = { term: string; text: ReactNode };
/* position: the crop anchor when the frame is narrower or wider than the artwork. */
type Figure = { src: string; position: string };
type Stage = {
  id: string;
  title: string;
  summary: string;
  details: Detail[];
  layout: "text-start" | "text-end" | "wide";
  figure: Figure;
};

const Code = ({ children }: { children: ReactNode }) => <code className={styles.code}>{children}</code>;

/* ---------- content ---------- */

const stages: Stage[] = [
  {
    id: "data",
    title: "Point-in-time market data",
    summary:
      "ATRX organizes market-state observations and systemic economic variables as structured records. Each record describes one instrument vector at a stated time. Read it as of that time: the fields hold what was known then, and the objective resolves only after the evaluation horizon.",
    details: [
      { term: "Record", text: <>One instrument vector, such as <Code>MET_SAFE</Code> or <Code>FX_DM</Code>, at a stated timestamp.</> },
      { term: "Fields", text: "Market state, economic variables and the regime classification known at that time. The schema is issued during onboarding." },
      { term: "Objective", text: "What the record is evaluated against: structural viability, execution eligibility or the realized outcome." },
      { term: "History", text: "Ledger exports keep decisions, state classifications and vetoes, so research studies the same record it will be reviewed against." },
    ],
    layout: "text-start",
    /* User-supplied artwork: a market seen at one moment. */
    figure: { src: "/workflow/market-square.webp", position: "50% 50%" },
  },
  {
    id: "modeling",
    title: "Research in your own stack",
    summary:
      "Build models, decision rules and research workflows on ATRX records in the language and framework your desk already uses. The aim is a forward-looking judgment the desk can defend: a signal, a classification or a position view that rests on an economic mechanism rather than co-movement alone.",
    details: [
      { term: "Inputs", text: "ATRX context, including the regime tag and structural identifier, beside your own positions, fills and house research." },
      { term: "Tools", text: "Python, JavaScript or your existing environment. Integration runs tenant-side and credentials stay inside it." },
      { term: "Standard", text: "A judgment needs an economic transmission channel. Historical correlation alone does not qualify." },
      { term: "Mandates", text: "Drawdown limits, exposure caps and blackout windows are written as rules. Capital Desk adds custom regime gating." },
    ],
    layout: "text-end",
    /* User-supplied artwork: a flowering valley, painted on black. */
    figure: { src: "/workflow/meadow.webp", position: "50% 55%" },
  },
  {
    id: "directives",
    title: "Live directives, routed under mandate",
    summary:
      "As new market state arrives, ATRX moves it through perception, synthesis, state gating and control. A directive that clears them reaches your endpoint as a signed, schema-validated payload. Your environment verifies it, keeps it, applies desk mandates and only then hands it to your risk engine.",
    details: [
      { term: "Identity", text: "Every payload carries the instrument, a regime tag and a structural identifier, so each decision can be traced later." },
      { term: "Integrity", text: "Payloads are signed and replay-protected. Verification parameters are issued during onboarding." },
      { term: "Routing", text: "Mandates apply before your risk engine receives the directive. Sizing and instrument permissions stay with the desk." },
      { term: "Hard stop", text: "When the current state matches a known failure vector, Control stops the directive outright." },
    ],
    layout: "wide",
    /* User-supplied artwork: a lighthouse sending one directed beam. */
    figure: { src: "/workflow/lighthouse.webp", position: "50% 50%" },
  },
  {
    id: "evaluation",
    title: "Evaluation against the record",
    summary:
      "Outputs are judged after the fact, over a review window the desk sets. Realized results are grouped by the regime and structure each payload carried, and ledger exports show what controls stopped, so a review covers decisions that never traded as well as those that did. Findings return to research and shape the next cycle.",
    details: [
      { term: "Primary measure", text: "Realized P&L from your own fills, attributed by regime tag and structural identifier rather than as one aggregate." },
      { term: "Control record", text: "State-gated decisions and risk vetoes, counted alongside the full decision set." },
      { term: "Cadence", text: "The desk sets the evaluation horizon and review cadence. ATRX supplies the context to read each window." },
      { term: "Limits", text: "A grouped result does not prove causation. Regime decay, shocks and execution friction remain." },
    ],
    layout: "text-start",
    /* A wood cross-section: years recorded ring by ring, a band of hard years, a healed wound. */
    figure: { src: "/workflow/rings.webp", position: "40% 45%" },
  },
];

export default function Workflow() {
  return (
    <div className={styles.workflow}>
      {stages.map((stage) => (
        <article
          key={stage.id}
          className={styles.stage}
          data-layout={stage.layout}
          aria-labelledby={`workflow-${stage.id}`}
        >
          <div className={styles.text}>
            <div className={styles.intro}>
              <h3 id={`workflow-${stage.id}`} className={styles.title}>
                {stage.title}
              </h3>
              <p className={styles.summary}>{stage.summary}</p>
            </div>
            <dl className={styles.details}>
              {stage.details.map((detail) => (
                <div key={detail.term} className={styles.detail}>
                  <dt>{detail.term}</dt>
                  <dd>{detail.text}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* Atmospheric art carries no information the text does not, so it is decorative. */}
          <figure className={styles.plate}>
            <Image
              src={stage.figure.src}
              alt=""
              fill
              sizes={stage.layout === "wide" ? "(max-width: 1000px) 100vw, 80vw" : "(max-width: 1000px) 100vw, 50vw"}
              className={styles.artImage}
              style={{ objectPosition: stage.figure.position }}
            />
          </figure>
        </article>
      ))}
    </div>
  );
}
