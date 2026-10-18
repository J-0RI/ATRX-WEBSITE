import Link from "next/link";
import DocsDirectory from "@/components/DocsDirectory";
import Practice from "@/components/Practice";
import Quickstart from "@/components/Quickstart";
import ArrowAction from "@/components/ArrowAction";
import { quickstart } from "@/content/code";
import { tokenize } from "@/lib/highlight";
import styles from "./home.module.css";

const prepare = <T extends { code: string; lang: Parameters<typeof tokenize>[1] }>(samples: T[]) =>
  samples.map(({ lang, ...s }) => ({ ...s, lines: tokenize(s.code, lang) }));

/* Four stages of institutional research discipline: concise by design. The statement above
   them carries the argument; these give it structure. Principle-level wording only: no ATRX
   capability, audit or predictive claim (decision-20261018-methodology-composition). */
const methodStages = [
  { title: "Isolate the signal", descriptor: "Distinguish market repricing from structural change." },
  { title: "Trace transmission", descriptor: "Examine policy, liquidity, and positioning channels." },
  { title: "Challenge the thesis", descriptor: "Test competing explanations, regimes, and constraints." },
  { title: "Preserve the rationale", descriptor: "Keep evidence, assumptions, and limitations reviewable." },
];

export default function OverviewPage() {
  const categories = quickstart.map((c) => ({ ...c, samples: prepare(c.samples) }));

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

      <section id="quickstart" className={styles.section} aria-labelledby="quickstart-title">
        <h2 id="quickstart-title" className={styles.sectionTitle}>
          Jump straight in
        </h2>
        <p className={styles.sectionLead}>
          Webhooks, guardrails, attribution, and audit telemetry inside your existing stack
        </p>
        <Quickstart categories={categories} />
        <div className={styles.sectionActions}>
          <Link href="/quickstart" className="btn btn-secondary">
            Open the quickstart guide
          </Link>
        </div>
      </section>

      <section id="directory" className={styles.section} aria-labelledby="directory-title">
        <h2 id="directory-title" className={styles.sectionTitle}>
          Explore the documentation
        </h2>
        <DocsDirectory />
      </section>
    </>
  );
}
