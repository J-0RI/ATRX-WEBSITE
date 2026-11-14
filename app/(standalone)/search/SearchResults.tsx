"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import ArrowAction from "@/components/ArrowAction";
import { CloseIcon, MoreIcon } from "@/components/Icons";
import { highlightSegments, type SearchResult } from "@/lib/search";
import styles from "./search.module.css";

type Props = {
  query: string;
  results: SearchResult[];
  areas: string[];
  initialSelected: string[];
  failed: boolean;
};

/** Matched text is wrapped in <mark>; everything renders as text, never as HTML. */
function Highlight({ text, query }: { text: string; query: string }) {
  return highlightSegments(text, query).map((part, index) =>
    part.match ? <mark key={index}>{part.text}</mark> : <span key={index}>{part.text}</span>);
}

export default function SearchResults({ query, results, areas, initialSelected, failed }: Props) {
  const [selected, setSelected] = useState(initialSelected);
  const titleId = useId();
  const filtersRef = useRef<HTMLFieldSetElement>(null);
  // One expanded result at a time, keyed by page identity (stable across filter changes).
  const [expanded, setExpanded] = useState<string | null>(null);
  // A result closed because another opened collapses without animating, so the page above the
  // newly opened result settles in one step and the scroll correction below can hold it still.
  const [settling, setSettling] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const anchor = useRef<{ id: string; top: number } | null>(null);

  useLayoutEffect(() => {
    const held = anchor.current;
    anchor.current = null;
    const row = held && rows.current.get(held.id);
    if (!held || !row) return;
    const shift = row.getBoundingClientRect().top - held.top;
    if (Math.abs(shift) >= 1) window.scrollBy({ top: shift, behavior: "instant" });
  }, [expanded]);

  const toggleDetail = (id: string) => {
    const switching = expanded !== null && expanded !== id;
    const row = rows.current.get(id);
    anchor.current = switching && row ? { id, top: row.getBoundingClientRect().top } : null;
    setSettling(switching ? expanded : null);
    setExpanded(expanded === id ? null : id);
  };

  const counts = new Map<string, number>();
  for (const result of results) counts.set(result.category, (counts.get(result.category) ?? 0) + 1);
  const visible = selected.length ? results.filter((result) => selected.includes(result.category)) : results;

  // Selection lives in the URL (?area=…) so refresh and shared links keep it; it never adds history entries.
  const commit = (next: string[]) => {
    setSelected(next);
    setExpanded(null);
    const params = new URLSearchParams({ q: query });
    for (const area of next) params.append("area", area);
    window.history.replaceState(null, "", `/search?${params}`);
  };
  // The Clear control disappears once used: keep keyboard focus inside the filters.
  const clear = () => {
    commit([]);
    filtersRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
  };
  const toggle = (area: string) => commit(selected.includes(area) ? selected.filter((item) => item !== area) : areas.filter((item) => item === area || selected.includes(item)));

  if (!query) {
    return (
      <div className={styles.workspace} data-empty-query>
        <div className={styles.notice}>
          <h2>Enter a search term</h2>
          <p>Use the search control in the navigation bar to search ATRX documentation, product and disclosure pages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      <fieldset ref={filtersRef} className={styles.filters} aria-describedby={titleId} disabled={failed || results.length === 0}>
        <legend className={styles.filterTitle}>Area</legend>
        <ul className={styles.options}>
          {areas.map((area) => {
            const count = counts.get(area) ?? 0;
            const checked = selected.includes(area);
            return (
              <li key={area}>
                <label className={styles.option} data-empty={count === 0 && !checked ? "" : undefined}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={count === 0 && !checked}
                    onChange={() => toggle(area)}
                    aria-label={`${area}, ${count} ${count === 1 ? "result" : "results"}`}
                  />
                  <span className={styles.optionLabel} aria-hidden="true">{area}</span>
                  <span className={styles.optionCount} aria-hidden="true">{count}</span>
                </label>
              </li>
            );
          })}
        </ul>
        {selected.length > 0 ? (
          <button type="button" className={styles.clear} onClick={clear}>
            Clear filters
          </button>
        ) : null}
      </fieldset>

      <section className={styles.results} aria-labelledby={titleId}>
        <p id={titleId} className={styles.summary} role="status">
          {failed
            ? "Search is unavailable"
            : results.length === 0
            ? "0 results"
            : selected.length
            ? `${visible.length} of ${results.length} results in ${selected.join(", ")}`
            : `${results.length} ${results.length === 1 ? "result" : "results"}`}
        </p>

        {failed ? (
          <div className={styles.notice}>
            <h2>Search could not be completed</h2>
            <p>The site index could not be read. Try again, or browse the documentation from the navigation bar.</p>
          </div>
        ) : results.length === 0 ? (
          <div className={styles.notice}>
            <h2>No indexed pages match <span className={styles.noticeQuery}>{query}</span></h2>
            <p>Check the spelling, or try a broader term such as a product area, capability or document name using the search control in the navigation bar.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className={styles.notice}>
            <h2>No results in the selected areas</h2>
            <p>
              <button type="button" className={styles.inlineClear} onClick={clear}>Clear filters</button> to see all {results.length} results.
            </p>
          </div>
        ) : (
          <ol className={styles.list}>
            {visible.map((result, index) => {
              const id = result.href + result.title;
              const open = expanded === id;
              const detailId = `${titleId}-detail-${index}`;
              return (
                <li
                  key={id}
                  ref={(node) => {
                    if (node) rows.current.set(id, node);
                    else rows.current.delete(id);
                  }}
                  className={styles.result}
                  data-open={open || undefined}
                  data-settling={settling === id || undefined}
                  /* The whole shell is the summary toggle's pointer surface. Clicks on its own
                     interactive children (the toggle itself, the View action) are theirs alone, and a
                     text selection is not a click. Keyboard users operate the toggle button. */
                  onClick={(event) => {
                    if ((event.target as Element).closest("a, button")) return;
                    const selection = window.getSelection();
                    if (selection && !selection.isCollapsed && event.currentTarget.contains(selection.anchorNode)) return;
                    toggleDetail(id);
                  }}
                >
                  <p className={styles.category}>{result.category}</p>
                  <h2 className={styles.title}>
                    <Highlight text={result.title} query={query} />
                  </h2>
                  <p className={styles.excerpt}>
                    <Highlight text={result.excerpt} query={query} />
                  </p>
                  {/* The result's one expand/collapse control; placed top-right by CSS. Only the
                      View action inside the summary navigates. */}
                  <button
                    type="button"
                    className={styles.more}
                    aria-expanded={open}
                    aria-controls={detailId}
                    aria-label={`${open ? "Hide" : "Show"} summary of ${result.title}`}
                    onClick={() => toggleDetail(id)}
                  >
                    {open ? <CloseIcon size={14} /> : <MoreIcon size={16} />}
                  </button>
                  <div id={detailId} className={styles.detail} inert={!open}>
                    <div className={styles.detailInner}>
                      {result.detail ? (
                        <p className={styles.detailText}>
                          <Highlight text={result.detail} query={query} />
                        </p>
                      ) : null}
                      <ArrowAction href={result.href} className={styles.detailAction}>
                        {result.action}
                      </ArrowAction>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
