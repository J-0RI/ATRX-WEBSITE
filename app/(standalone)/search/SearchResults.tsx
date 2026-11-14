"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
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

  const counts = new Map<string, number>();
  for (const result of results) counts.set(result.category, (counts.get(result.category) ?? 0) + 1);
  const visible = selected.length ? results.filter((result) => selected.includes(result.category)) : results;

  // Selection lives in the URL (?area=…) so refresh and shared links keep it; it never adds history entries.
  const commit = (next: string[]) => {
    setSelected(next);
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
            {visible.map((result) => (
              <li key={result.href + result.title} className={styles.result}>
                <p className={styles.category}>{result.category}</p>
                <h2 className={styles.title}>
                  <Link href={result.href}>
                    <Highlight text={result.title} query={query} />
                  </Link>
                </h2>
                <p className={styles.excerpt}>
                  <Highlight text={result.excerpt} query={query} />
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
