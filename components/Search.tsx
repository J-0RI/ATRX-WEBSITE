"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/content/nav";
import { CloseIcon, SearchIcon } from "./Icons";
import styles from "./Search.module.css";

export type SearchState = "closed" | "open" | "closing";

type Props = {
  state: SearchState;
  onOpen: () => void;
  onClose: (restoreFocus: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

/*
 * Inline navbar search. The trigger is an ordinary navigation cell; the bar is one
 * surface laid over the measured shell region (TopNav sets --search-* on .inner) and
 * revealed by clip-path from the Search cell's own rectangle. No modal, no popup:
 * results drop beneath the bar in the shared nav-dropdown material.
 */
export default function Search({ state, onOpen, onClose, triggerRef }: Props) {
  const router = useRouter();
  const open = state === "open";
  const barRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  // Expansion (TopNav `state`) and input focus are independent: losing focus never closes.
  const [focused, setFocused] = useState(false);
  const [resultsDismissed, setResultsDismissed] = useState(false);
  const uid = useId();
  const barId = `${uid}-bar`;
  const listId = `${uid}-list`;

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      q
        ? searchIndex.filter(
            (r) =>
              r.label.toLowerCase().includes(q) ||
              r.section.toLowerCase().includes(q) ||
              (r.keywords?.toLowerCase().includes(q) ?? false),
          )
        : [],
    [q],
  );
  // Suggestions follow focus; they never control whether the bar stays expanded.
  const showResults = open && focused && !resultsDismissed && q.length > 0;

  // Each opening starts clean; focus moves into the field as the surface appears.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setResultsDismissed(false);
    inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // ⌘K / Ctrl K opens the bar, or returns focus to it when already open. Only X closes.
  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (stateRef.current === "open") inputRef.current?.focus();
        else onOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpen]);

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  // Choosing a result navigates; the bar stays expanded with its query (State C).
  const go = (href: string) => {
    setResultsDismissed(true);
    inputRef.current?.blur();
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={onOpen}
        aria-label="Search ATRX"
        aria-expanded={open}
        aria-controls={barId}
        aria-keyshortcuts="Meta+K Control+K"
        inert={open}
      >
        <SearchIcon size={16} />
        <span className={styles.triggerLabel}>Search</span>
      </button>

      <form
        ref={barRef}
        id={barId}
        role="search"
        aria-label="Search ATRX"
        className={styles.bar}
        inert={!open}
        onSubmit={(e) => {
          e.preventDefault();
          if (results[active]) go(results[active].href);
        }}
        onKeyDown={(e) => {
          // Escape dismisses suggestions only; the bar stays expanded.
          if (e.key === "Escape" && showResults) {
            e.preventDefault();
            setResultsDismissed(true);
          }
        }}
        onFocus={() => {
          setFocused(true);
          setResultsDismissed(false);
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (!next || (!barRef.current?.contains(next) && !panelRef.current?.contains(next))) setFocused(false);
        }}
        onPointerDown={(e) => {
          // Pressing the bar's icon or padding returns focus to the field, never closes it.
          if (e.target === inputRef.current || (e.target as Element).closest("button")) return;
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <SearchIcon size={14} className={styles.barIcon} />
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search ATRX"
          aria-label="Search ATRX"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls={listId}
          aria-activedescendant={showResults && results[active] ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setResultsDismissed(false);
          }}
          onKeyDown={onInputKey}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        <button type="button" className={styles.close} aria-label="Close search" onClick={() => onClose(true)}>
          <CloseIcon size={14} />
        </button>
      </form>

      <div ref={panelRef} className={styles.panel} data-visible={showResults || undefined}>
        <ul id={listId} role="listbox" aria-label="Search results" className={styles.results}>
          {results.length === 0 ? (
            <li className={styles.empty}>No matching pages</li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.href}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className={styles.option}
                // Keep focus in the field so choosing a result never blurs the bar first.
                onPointerDown={(e) => e.preventDefault()}
                onPointerMove={() => setActive(i)}
                onClick={() => go(r.href)}
              >
                <span>{r.label}</span>
                <span className={styles.section}>{r.section}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <span className="visually-hidden" role="status" aria-live="polite">
        {showResults ? (results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : "No matching pages") : ""}
      </span>
    </>
  );
}
