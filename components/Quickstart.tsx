"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { QuickstartCategory } from "@/content/code";
import CodeTabs, { type PreparedSample } from "./CodeTabs";
import { CheckIcon } from "./Icons";
import { onTabListKeyDown } from "./tabs";
import styles from "./Quickstart.module.css";

export type PreparedCategory = Omit<QuickstartCategory, "samples"> & { samples: PreparedSample[] };

export default function Quickstart({ categories }: { categories: PreparedCategory[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabIds = categories.map((c) => `${uid}-cat-${c.id}`);
  const current = categories[active];

  return (
    <div className={styles.panel}>
      <div
        role="tablist"
        aria-label="Integration category"
        className={styles.categories}
        onKeyDown={(e) => onTabListKeyDown(e, tabIds, active, setActive)}
      >
        {categories.map((c, i) => (
          <button
            key={c.id}
            id={tabIds[i]}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={styles.category}
            onClick={() => setActive(i)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={tabIds[active]} className={styles.grid}>
        <CodeTabs
          key={current.id}
          samples={current.samples}
          label={`${current.label} example language`}
          variant="pill"
          className={styles.code}
        />
        <div className={styles.info}>
          <h3 className={styles.title}>{current.title}</h3>
          <p className={styles.description}>{current.description}</p>
          <ul className={styles.points}>
            {current.points.map((p) => (
              <li key={p}>
                <span className={styles.mark}>
                  <CheckIcon size={14} />
                </span>
                {p}
              </li>
            ))}
            {current.tiers.map((t) => (
              <li key={t.text}>
                <span className={`${styles.mark} ${styles.tierMark}`}>
                  <span className="visually-hidden">Tier </span>
                  {t.tier}
                  <span className="visually-hidden">: </span>
                </span>
                {t.text}
              </li>
            ))}
          </ul>
          <Link href={current.href} className={`btn btn-secondary ${styles.action}`}>
            Read docs
          </Link>
        </div>
      </div>
    </div>
  );
}
