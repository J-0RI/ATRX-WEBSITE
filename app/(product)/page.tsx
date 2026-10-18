import Link from "next/link";
import DocsDirectory from "@/components/DocsDirectory";
import Quickstart from "@/components/Quickstart";
import TierCard from "@/components/TierCard";
import ArrowAction from "@/components/ArrowAction";
import { quickstart } from "@/content/code";
import { tiers } from "@/content/tiers";
import { tokenize } from "@/lib/highlight";
import styles from "./home.module.css";

const prepare = <T extends { code: string; lang: Parameters<typeof tokenize>[1] }>(samples: T[]) =>
  samples.map(({ lang, ...s }) => ({ ...s, lines: tokenize(s.code, lang) }));

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

      <section id="access" className={styles.section} aria-labelledby="access-title">
        <h2 id="access-title" className={styles.sectionTitle}>
          Access
        </h2>
        <div className={styles.cards}>
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
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
