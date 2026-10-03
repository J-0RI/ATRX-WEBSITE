import Link from "next/link";
import CodeTabs from "@/components/CodeTabs";
import DocsDirectory from "@/components/DocsDirectory";
import Quickstart from "@/components/Quickstart";
import TierCard from "@/components/TierCard";
import { ChevronRight } from "@/components/Icons";
import { heroSamples, quickstart } from "@/content/code";
import { tiers } from "@/content/tiers";
import { tokenize } from "@/lib/highlight";
import styles from "./home.module.css";

const prepare = <T extends { code: string; lang: Parameters<typeof tokenize>[1] }>(samples: T[]) =>
  samples.map(({ lang, ...s }) => ({ ...s, lines: tokenize(s.code, lang) }));

export default function OverviewPage() {
  const hero = prepare(heroSamples);
  const categories = quickstart.map((c) => ({ ...c, samples: prepare(c.samples) }));

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroText}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Get started
            <span className={styles.heroTitleMuted}>with ATRX</span>
          </h1>
          <p className={styles.heroLead}>
            Systemic macro intelligence, disciplined risk controls, and execution precision.
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className="btn btn-primary">
              Request access
              <ChevronRight size={14} />
            </Link>
            <Link href="/architecture" className="btn btn-secondary">
              Read architecture
            </Link>
          </div>
        </div>
        <CodeTabs samples={hero} label="Integration example language" className={styles.heroCode} />
      </section>

      <section className={styles.section} aria-labelledby="access-title">
        <h2 id="access-title" className={styles.sectionTitle}>
          Access
        </h2>
        <div className={styles.cards}>
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="quickstart-title">
        <h2 id="quickstart-title" className={styles.sectionTitle}>
          Jump straight in
        </h2>
        <p className={styles.sectionLead}>
          Webhooks, guardrails, attribution, and audit telemetry inside your existing stack
        </p>
        <Quickstart categories={categories} />
      </section>

      <section className={styles.section} aria-labelledby="directory-title">
        <h2 id="directory-title" className={styles.sectionTitle}>
          Explore the documentation
        </h2>
        <DocsDirectory />
      </section>
    </>
  );
}
