"use client";

import { useState } from "react";
import Link from "next/link";
import SegmentedSwitch from "@/components/SegmentedSwitch";
import { KnightIcon } from "@/components/Icons";
import { accessPlans, planApplyHref, tiers, type ModeId } from "@/content/tiers";
import Image from "next/image";
import { planImages } from "./planImages";
import styles from "./explore.module.css";

const options = tiers.map((tier) => ({ id: tier.id, label: tier.name }));

/**
 * First-section-only mode switcher (decision-20261114-access-plan-families). Selection is
 * local to this component: it changes only the plan cards below it, never the comparison.
 * Cards carry only image → plan name → description → three capabilities → Apply; the
 * selected mode is named by the switcher, never repeated inside a card.
 */
export default function AccessPlans() {
  const [mode, setMode] = useState<ModeId>("prosumer-node");
  const tier = tiers.find((t) => t.id === mode)!;
  const plans = accessPlans[mode];

  return (
    <>
      <div className={styles.modeSwitch}>
        <SegmentedSwitch
          options={options}
          value={mode}
          onChange={setMode}
          label="Access mode"
          idPrefix="access-mode"
          panelId="access-plans"
        />
      </div>

      <div
        id="access-plans"
        role="tabpanel"
        aria-labelledby={`access-mode-${mode}`}
        className={styles.modes}
        data-count={plans.length}
      >
        {plans.map((plan, index) => (
          <article key={plan.id} className={styles.mode} aria-labelledby={`${plan.id}-plan`}>
            <div className={styles.media}>
              <Image
                src={planImages[plan.id].src}
                alt={planImages[plan.id].alt}
                fill
                sizes="(max-width: 1179px) min(600px, 100vw), 400px"
                /* Only the selected mode renders. Its first photo is the page's LCP element; on phones
                   the later cards stack below the fold, so they load when they approach the viewport. */
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
                className={styles.mediaImage}
                style={{ objectPosition: planImages[plan.id].position }}
              />
            </div>
            <h3 id={`${plan.id}-plan`} className={styles.title}>
              {plan.name}
            </h3>
            <p className={styles.description}>{plan.summary}</p>
            <ul className={styles.highlights}>
              {plan.capabilities.map((item) => (
                <li key={item}>
                  <KnightIcon size={16} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={planApplyHref(plan)}
              className={`btn btn-primary ${styles.cta}`}
              aria-label={`Apply for ${tier.name} ${plan.name}`}
            >
              Apply
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
