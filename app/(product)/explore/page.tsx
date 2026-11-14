import type { Metadata } from "next";
import Link from "next/link";
import { Note, Related } from "@/components/Doc";
import { CheckIcon } from "@/components/Icons";
import { accessComparison, tiers } from "@/content/tiers";
import ModeComparison from "./ModeComparison";
import ModeVisual from "./ModeVisual";
import styles from "./explore.module.css";

export const metadata: Metadata = {
  title: "Access modes",
  description:
    "The three ATRX access modes side by side: who each serves, how it is deployed, and a searchable comparison of published scope.",
};

export default function ExplorePage() {
  return (
    <>
      <section id="modes" className={styles.modesSection} aria-labelledby="modes-heading">
        <h1 id="modes-heading" className={styles.pageTitle}>
          Access modes
        </h1>
        <div className={styles.modes}>
          {tiers.map((tier) => (
            <article key={tier.id} className={styles.mode} aria-labelledby={`${tier.id}-mode`}>
              <div className={styles.media}>
                <ModeVisual mode={tier.id} />
              </div>
              <h3 id={`${tier.id}-mode`} className={styles.title}>
                {tier.name}
              </h3>
              <p className={styles.description}>{tier.audience}</p>
              <p className={styles.terms}>By application · {tier.commercial}</p>
              <ul className={styles.highlights}>
                {tier.highlights.map((item) => (
                  <li key={item}>
                    <CheckIcon size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={tier.apply} className={`btn btn-primary ${styles.cta}`} aria-label={`Apply for ${tier.name}`}>
                Apply
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="compare" className={styles.compareSection} aria-labelledby="compare-heading">
        <h2 id="compare-heading" className={styles.compareTitle}>
          Compare features across modes
        </h2>
        <ModeComparison
          groups={accessComparison}
          modes={tiers.map((tier) => ({ id: tier.id, name: tier.name }))}
        />
      </section>

      <Note>
        Scope describes each mode’s published configuration. It does not confirm instrument activation, capacity or a
        delivery-time guarantee; <Link href="/capabilities/market-coverage">Market Coverage</Link> records instrument
        status, and applications are evaluated against available compute capacity.
      </Note>

      <Related
        links={[
          { label: "Access tiers", href: "/access" },
          { label: "Deployment process", href: "/partnerships#deployment" },
          { label: "Risk disclosure", href: "/risk" },
        ]}
      />
    </>
  );
}
