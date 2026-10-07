import Link from "next/link";
import type { Tier } from "@/content/tiers";
import styles from "./TierCard.module.css";

export default function TierCard({ tier }: { tier: Tier }) {
  return (
    <article className={styles.card} aria-labelledby={`${tier.id}-title`}>
      <h3 id={`${tier.id}-title`} className={styles.title}>
        {tier.name}
      </h3>
      <p className={styles.meta}>{tier.tier}</p>
      <p className={styles.description}>{tier.description}</p>
      <dl className={styles.specs}>
        {tier.specs.map((spec) => (
          <div key={spec.label} className={styles.row}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
        <div className={styles.row}>
          <dt>By application</dt>
          <dd>
            <Link href={`/access#${tier.id}`} className={styles.termsLink}>
              {tier.commercial}
            </Link>
          </dd>
        </div>
      </dl>
      <div className={styles.actions}>
        <Link href={tier.apply} className="btn btn-primary">
          Apply
        </Link>
        <Link href={`/access/${tier.id}`} className="btn btn-secondary">
          Tier details
        </Link>
      </div>
    </article>
  );
}
