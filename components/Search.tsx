"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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
 * revealed by clip-path from the Search cell's own rectangle. Submitting opens
 * the dedicated results route; the bar stays open until its X is activated.
 */
export default function Search({ state, onOpen, onClose, triggerRef }: Props) {
  const router = useRouter();
  const open = state === "open";
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const uid = useId();
  const barId = `${uid}-bar`;

  // Each opening starts clean; focus moves into the field as the surface appears.
  useEffect(() => {
    if (!open) return;
    setQuery("");
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
      </button>

      <form
        id={barId}
        role="search"
        aria-label="Search ATRX"
        className={styles.bar}
        inert={!open}
        onSubmit={(e) => {
          e.preventDefault();
          const term = query.replace(/\s+/g, " ").trim();
          if (!term) return;
          inputRef.current?.blur();
          router.push(`/search?${new URLSearchParams({ q: term })}`);
        }}
        onKeyDown={(e) => {
          // The X remains the sole close control; Escape relinquishes input focus.
          if (e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.blur();
          }
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        <button type="button" className={styles.close} aria-label="Close search" onClick={() => onClose(true)}>
          <CloseIcon size={14} />
        </button>
      </form>
    </>
  );
}
