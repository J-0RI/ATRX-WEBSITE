"use client";

import { useState } from "react";
import Link from "next/link";
import SegmentedSwitch from "@/components/SegmentedSwitch";
import { KnightIcon } from "@/components/Icons";
import { accessPlans, tiers, type ModeId } from "@/content/tiers";
import ModeVisual from "./ModeVisual";
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
        {plans.map((plan) => (
          <article key={plan.id} className={styles.mode} aria-labelledby={`${plan.id}-plan`}>
            <div className={styles.media}>
              <ModeVisual plan={plan.id} />
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
              href={tier.apply}
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
