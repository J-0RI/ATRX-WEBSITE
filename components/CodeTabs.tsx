"use client";

import { useId, useState } from "react";
import type { TokenLine } from "@/lib/highlight";
import CopyButton from "./CopyButton";
import { onTabListKeyDown } from "./tabs";
import styles from "./CodeTabs.module.css";

export type PreparedSample = { id: string; label: string; code: string; lines: TokenLine[] };

type Props = {
  samples: PreparedSample[];
  label: string;
  variant?: "plain" | "pill";
  className?: string;
};

export default function CodeTabs({ samples, label, variant = "plain", className }: Props) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabIds = samples.map((s) => `${uid}-tab-${s.id}`);
  const current = samples[active] ?? samples[0];

  return (
    <div className={`${styles.panel} ${className ?? ""}`}>
      <div className={styles.rail}>
        <div
          role="tablist"
          aria-label={label}
          className={`${styles.tabs} ${variant === "pill" ? styles.pill : ""}`}
          onKeyDown={(e) => onTabListKeyDown(e, tabIds, active, setActive)}
        >
          {samples.map((s, i) => (
            <button
              key={s.id}
              id={tabIds[i]}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <CopyButton text={current.code} />
      </div>
      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={tabIds[active]}
        className={styles.body}
        tabIndex={0}
      >
        <pre className={styles.pre}>
          <code>
            {current.lines.map((line, li) => (
              <span key={li}>
                {line.map((tok, ti) =>
                  tok.t ? (
                    <span key={ti} className={`tok-${tok.t}`}>
                      {tok.v}
                    </span>
                  ) : (
                    tok.v
                  ),
                )}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
