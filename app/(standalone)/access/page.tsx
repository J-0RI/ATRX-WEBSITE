import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, Note, Related } from "@/components/Doc";
import { CheckIcon } from "@/components/Icons";
import { tiers } from "@/content/tiers";
import styles from "./access.module.css";

export const metadata: Metadata = {
  title: "Platform Access",
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
