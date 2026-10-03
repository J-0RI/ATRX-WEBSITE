"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/content/nav";
import { SearchIcon } from "./Icons";
import styles from "./Search.module.css";

export default function Search() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [shortcut, setShortcut] = useState("⌘K");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex;
    return searchIndex.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q) ||
        (r.keywords?.toLowerCase().includes(q) ?? false),
    );
  }, [query]);

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActive(0);
    dialog.showModal();
    inputRef.current?.focus();
  };

  const go = (href: string) => {
    dialogRef.current?.close();
    router.push(href);
  };

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.userAgent)) setShortcut("Ctrl K");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  useEffect(() => {
    document
      .getElementById(`search-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <>
      <button type="button" className={styles.trigger} onClick={open} aria-label="Search documentation">
        <SearchIcon size={16} />
        <span className={styles.triggerLabel}>Search</span>
        <kbd className={styles.kbd}>{shortcut}</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Search documentation"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className={styles.field}>
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="Search documentation"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-opt-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>
        <ul id="search-results" role="listbox" className={styles.results} aria-label="Results">
          {results.length === 0 ? (
            <li className={styles.empty}>No matching pages</li>
          ) : (
            results.map((r, i) => (
              <li
                key={r.href}
                id={`search-opt-${i}`}
                role="option"
                aria-selected={i === active}
                className={styles.option}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r.href)}
              >
                <span>{r.label}</span>
                <span className={styles.section}>{r.section}</span>
              </li>
            ))
          )}
        </ul>
      </dialog>
    </>
  );
}
