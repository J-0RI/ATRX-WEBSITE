import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, Note, Related } from "@/components/Doc";
import { CheckIcon } from "@/components/Icons";
import { tiers } from "@/content/tiers";
import styles from "./access.module.css";
import productStyles from "@/components/ProductContent.module.css";

export const metadata: Metadata = {
  title: "Access Tiers",
  description:
    "ATRX is operating in a closed deployment phase. Three tiers, granted by application.",
};

export default function AccessPage() {
  return (
    <>
      <DocHeader title="Compute constrained. Qualified allocators only.">
        <p>
          ATRX is operating in a closed deployment phase. Platform access is granted exclusively to
          qualified enterprise desks and quantitative prosumers.
        </p>
        <p>
          The core pipeline operates under a strict compute and latency budget. Access is granted by
          application to ensure infrastructure bandwidth and execution quality remain uncompromised.
          Pricing is provided upon technical qualification.
        </p>
      </DocHeader>

      <DocSection title="Compare access tiers">
        <div className={productStyles.comparison} role="region" aria-label="Access tier comparison" tabIndex={0}>
          <table className={productStyles.table}>
            <caption>Published deployment scope. Instrument activation status is listed separately in Market Coverage.</caption>
            <thead><tr><th scope="col">Configuration</th>{tiers.map((tier) => <th scope="col" key={tier.id}>{tier.name}</th>)}</tr></thead>
            <tbody>
              <tr><th scope="row">Deployment</th><td>Single-tenant execution pipeline</td><td>Multi-node cohort allocation</td><td>Dedicated inference cluster · AWS/GCP</td></tr>
              <tr><th scope="row">Intelligence scope</th><td>Core FX &amp; Metals vectors</td><td>Expanded Indices &amp; Energy topology</td><td>Bespoke structural topology modeling</td></tr>
              <tr><th scope="row">Published distinction</th><td>API-level systemic guardrails</td><td>Custom regime gating &amp; drawdown parameters</td><td>Whitepapers, ablation studies &amp; governance telemetry</td></tr>
              <tr><th scope="row">Integration</th><td>Standard JSON webhook</td><td>Direct low-latency SDKs; priority latency routing</td><td>Direct engineering syncs</td></tr>
              <tr><th scope="row">Commercial basis</th>{tiers.map((tier) => <td key={tier.id}>{tier.commercial}</td>)}</tr>
            </tbody>
          </table>
        </div>
        <Note>Tier scope is not a statement that every instrument is live. <Link href="/capabilities/market-coverage">Market Coverage</Link> distinguishes Phase 1 live-traded FX and Metals from preparing-v4.0 and roadmap vectors.</Note>
      </DocSection>

      <div className={styles.grid}>
        {tiers.map((tier) => (
          <article key={tier.id} id={tier.id} className={styles.card} aria-labelledby={`${tier.id}-name`}>
            <p className={styles.meta}>{tier.tier}</p>
            <h2 id={`${tier.id}-name`} className={styles.name}>
              {tier.name}
            </h2>
            <p className={styles.terms}>By application · {tier.commercial}</p>
            <ul className={styles.features}>
              {tier.features.map((f) => (
                <li key={f}>
                  <CheckIcon size={14} />
                  {f}
                </li>
              ))}
            </ul>
            <div className={styles.action}>
              <Link href={tier.apply} className="btn btn-primary">
                Apply
              </Link>
              <Link href={`/access/${tier.id}`} className="btn btn-secondary">Deployment guide</Link>
            </div>
          </article>
        ))}
      </div>

      <Note>
        Applications are evaluated against available compute capacity and infrastructural alignment.
        ATRX reserves the right to decline access requests to preserve system integrity.
      </Note>

      <Related
        links={[
          { label: "Enterprise tenancy", href: "/partnerships" },
          { label: "Deployment process", href: "/partnerships#deployment" },
          { label: "Risk disclosure", href: "/risk" },
        ]}
      />
    </>
  );
}
