"use client";

import { useRef, type KeyboardEvent } from "react";
import styles from "./SegmentedSwitch.module.css";

export type SegmentOption<T extends string> = { id: T; label: string };

/**
 * Tablist segmented switcher (Haldane Policies-page design). Selection is local state owned
 * by the caller; it never navigates, scrolls or reloads. Roving tabindex with
 * ArrowLeft/ArrowRight/Home/End, matching the Policies-page keyboard model.
 */
export default function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  label,
  idPrefix,
  panelId,
  className,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  idPrefix: string;
  panelId: string;
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % options.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + options.length) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    if (next === null) return;
    event.preventDefault();
    const target = options[next].id;
    listRef.current?.querySelector<HTMLButtonElement>(`#${idPrefix}-${target}`)?.focus({ preventScroll: true });
    onChange(target);
  }

  return (
    <div className={`${styles.frame}${className ? ` ${className}` : ""}`}>
      <ul className={styles.list} role="tablist" aria-label={label} ref={listRef}>
        {options.map((option, index) => {
          const selected = option.id === value;
          return (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="tab"
                id={`${idPrefix}-${option.id}`}
                className={styles.segment}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(option.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
