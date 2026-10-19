import Link from "next/link";
import Practice from "@/components/Practice";
import Workflow from "@/components/Workflow";
import ArrowAction from "@/components/ArrowAction";
import { Blocks, Scale, Signpost } from "lucide-react";
import { tiers } from "@/content/tiers";
import styles from "./home.module.css";

/* Four stages of institutional research discipline: concise by design. The statement above
   them carries the argument; these give it structure. Principle-level wording only: no ATRX
   capability, audit or predictive claim (decision-20261018-methodology-composition). */
const methodStages = [
  { title: "Isolate the signal", descriptor: "Distinguish market repricing from structural change." },
  { title: "Trace transmission", descriptor: "Examine policy, liquidity, and positioning channels." },
  { title: "Challenge the thesis", descriptor: "Test competing explanations, regimes, and constraints." },
  { title: "Preserve the rationale", descriptor: "Keep evidence, assumptions, and limitations reviewable." },
];

/* Icons are distinct from every glyph already on the page (Practice switcher, alerts).
   The institution's side of adoption: the decision served, the operating model, and who stays
   accountable. Considerations for the institution, not ATRX features or onboarding steps. */
const fitPoints = [
  {
    icon: Signpost,
    title: "Intelligence needs a decision to serve.",
    text: "Identify the research question, portfolio judgment or investment decision ATRX would inform. Its relevance depends on the choice the institution faces, the horizon over which it matters and the boundaries of its mandate.",
  },
  {
    icon: Blocks,
    title: "Place it within the operating model.",
    text: "Consider who interprets the intelligence, which risk requirements constrain its use and how it enters the existing research workflow. Analytical usefulness alone does not establish operational compatibility.",
  },
  {
    icon: Scale,
    title: "Keep responsibility explicit.",
    text: "Assumptions, limitations and supporting evidence need to remain open to scrutiny. Establish who reviews the judgment and what would warrant reassessment in the institution’s own environment. Decision authority stays with the institution.",
  },
];

/* The closing primary action opens the Capital Desk application (engagement preselected). */
const capitalDesk = tiers.find((tier) => tier.id === "capital-desk")!;

export default function OverviewPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <h1 id="hero-title" className={styles.heroTitle}>
          One integrated platform for a clearer <span className={styles.heroAccent}>strategic advantage</span>.
        </h1>
        {/* Sources: philosophy (audiences, cloud/API distribution); market intelligence
            (economic transmission beyond co-movement); regime & state analysis, control
            protocol, causal attribution and audit-grade ledgers (gating, veto, payload
            context, decision logs). */}
        <div className={styles.heroDetail}>
          <p className={styles.heroColumn}>
            ATRX is designed for systematic allocators, professional trading teams, and
            enterprise desks that need to interpret complex market conditions together rather
            than in isolation. Delivered through cloud compute and API distribution, the
            platform brings institutional market intelligence into existing workflows,
            supporting consistent research without requiring every organization to build the
            underlying infrastructure.
          </p>
          <p className={styles.heroColumn}>
            Rather than treating price movements as self-explanatory, ATRX examines the
            economic forces, policy developments, and changing conditions behind market
            opportunities. Assessments are considered alongside prevailing market conditions
            and risk controls, preserving context for research and review. Its purpose is to
            support accountable professional judgment, not promise certainty or replace
            institutional decision-making authority.
          </p>
        </div>
        <div className={`${styles.heroActions} ${styles.heroCtas}`}>
          <ArrowAction href="/contact">Request access</ArrowAction>
          <Link href="/architecture" className="btn btn-secondary">
            Read architecture
          </Link>
        </div>
      </section>

      {/* Chapter 2 — methodology (decision-20261018-overview-narrative,
          decision-20261018-methodology-composition): one editorial statement, then four
          minimal stages. Grounded in general research practice, not ATRX capability claims. */}
      <section id="method" className={styles.section} aria-labelledby="method-title">
        <div className={styles.methodStatement}>
          <h2 id="method-title" className={styles.methodThesis}>
            A market move is an observation, not an investment thesis.
          </h2>{" "}
          <p className={styles.methodArgument}>
            Institutional research must examine the economic transmission, challenge competing
            explanations, establish where the thesis could fail, and preserve the evidence behind
            the judgment.
          </p>
        </div>
        <ol className={styles.methodStages}>
          {methodStages.map((stage, i) => (
            <li key={stage.title} className={styles.methodStage}>
              <span className={styles.methodIndex} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.methodTitle}>{stage.title}</h3>
              <p className={styles.methodDescriptor}>{stage.descriptor}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="practice" className={styles.section} aria-labelledby="practice-title">
        <h2 id="practice-title" className={styles.sectionTitle}>
          ATRX in practice
        </h2>
        <Practice />
      </section>

      {/* Chapter 4 — the operating cycle behind the views above (decision-20261018-workflow-chapter). */}
      <section id="workflow" className={styles.section} aria-labelledby="workflow-title">
        <h2 id="workflow-title" className={`${styles.sectionTitle} ${styles.sectionStatement}`}>
          From point-in-time data to live directives and a record your desk can review.
        </h2>
        <Workflow />
      </section>

      {/* Research validity → institutional applicability → invitation. The editorial argument
          follows the desk's authority in Native Risk Mandates, the review limitations in
          Causal Attribution, and the governance role of Audit-Grade Ledgers. These are
          considerations for the institution, not new ATRX features or onboarding requirements. */}
      <div className={styles.conclusion}>
        <section id="adoption" className={styles.fit} aria-labelledby="adoption-title">
          <header className={styles.fitOpening}>
            <h2 id="adoption-title" className={styles.fitTitle}>
              A research judgment still has to meet the mandate.
            </h2>
            <p className={styles.fitStatement}>
              A defensible result can still be unsuitable for a particular institution.
              The mandate gives the research its decision context.
            </p>
          </header>

          {/* Three considerations of equal weight, read left to right (reference layout,
              2026-10-18): icon, title and text above a quiet left rule. Icons are decorative. */}
          <div className={styles.fitPoints}>
            {fitPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className={styles.fitPoint}>
                <Icon className={styles.fitIcon} size={24} strokeWidth={1.5} aria-hidden="true" />
                <h3 className={styles.fitPointTitle}>{title}</h3>
                <p className={styles.fitPointText}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="begin" className={styles.closing} aria-labelledby="begin-title">
          <h2 id="begin-title" className={styles.closingTitle}>
            <span>
              Power your <span className={styles.closingKeep}>most demanding</span>
            </span>{" "}
            <span>research with ATRX.</span>
          </h2>
          <div className={styles.closingActions}>
            <Link href={capitalDesk.apply} className="btn btn-primary">
              Get Capital Desk
            </Link>
            <Link href="/documentation" className="btn btn-secondary">
              Explore documentation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
