import type { Metadata } from "next";
import Link from "next/link";
import { Note, Related } from "@/components/Doc";
import { accessComparison, tiers } from "@/content/tiers";
import ModeComparison from "./ModeComparison";
import AccessPlans from "./AccessPlans";
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
        <AccessPlans />
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
        status, and applications are evaluated against available compute capacity. Plan allocations within each mode
        are provisional and are confirmed during application.
      </Note>

      <Related
        links={[
          { label: "Frequently Asked Questions", href: "/faq" },
          { label: "Deployment process", href: "/partnerships#deployment" },
          { label: "Risk disclosure", href: "/risk" },
        ]}
      />
    </>
  );
}
