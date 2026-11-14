"use client";

import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, CloseIcon, InfoIcon, SearchIcon } from "@/components/Icons";
import type { ComparisonCell, ComparisonGroup, ComparisonRow, DeliveryStatus, ModeId } from "@/content/tiers";
import styles from "./explore.module.css";

type Mode = { id: string; name: string };

function cellText(cell: ComparisonCell) {
  return cell.kind === "included" ? "Included" : cell.kind === "unavailable" ? "Unavailable" : "Optional, varies by plan";
}

function statusBadge(status: DeliveryStatus): string | null {
  switch (status) {
    case "available":
      return null;
    case "in-development":
      return "In development";
    case "planned":
      return "Planned";
    case "qualification":
      return "By qualification";
  }
}

function statusFullLabel(status: DeliveryStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "in-development":
      return "In development";
    case "planned":
      return "Planned";
    case "qualification":
      return "Subject to technical qualification";
  }
}

function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[-–—/_.,():;'"&]+/g, " ").replace(/\s+/g, " ").trim();
}

function rowMatchesQuery(row: ComparisonRow, groupTitle: string, modes: Mode[], tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const badge = statusBadge(row.status) ?? "";
  const fullStatus = statusFullLabel(row.status);
  const modeStatuses = modes.map((mode) => cellText(row.values[mode.id as ModeId])).join(" ");
  const haystack = normalizeSearch(
    `${groupTitle} ${row.label} ${row.id} ${row.description} ${row.keywords.join(" ")} ${badge} ${fullStatus} ${modeStatuses}`,
  );
  return tokens.every((token) => haystack.includes(token));
}

function Cell({ cell }: { cell: ComparisonCell }) {
  if (cell.kind === "included") {
    return (
      <span className={`${styles.indicator} ${styles.included}`} title="Included">
        <span aria-hidden="true">O</span>
        <span className="visually-hidden">Included</span>
      </span>
    );
  }
  if (cell.kind === "unavailable") {
    return (
      <span className={`${styles.indicator} ${styles.unavailable}`} title="Unavailable">
        <span aria-hidden="true">X</span>
        <span className="visually-hidden">Unavailable</span>
      </span>
    );
  }
  if (cell.kind === "optional") {
    return (
      <span className={styles.optional}>
        <span className={styles.optionalChip} aria-hidden="true">
          Optional
        </span>
        <span className={styles.optionalNote} aria-hidden="true">
          varies by plan
        </span>
        <span className="visually-hidden">Optional, can be included depending on plan</span>
      </span>
    );
  }
}

/**
 * Searchable comparison of published access-mode scope. Header and feature cells share one
 * table grid; categories remain independently collapsible while search narrows their rows.
 */
export default function ModeComparison({ groups, modes }: { groups: ComparisonGroup[]; modes: Mode[] }) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [searchCollapsed, setSearchCollapsed] = useState<string[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const uid = useId();
  const theadRef = useRef<HTMLTableSectionElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const closeTimerRef = useRef<number | null>(null);

  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  const isSearching = tokens.length > 0;
  const activeCollapsed = isSearching ? searchCollapsed : collapsed;

  const visible = useMemo(
    () =>
      groups
        .map((group) => {
          const rows = group.rows.filter((row) => rowMatchesQuery(row, group.title, modes, tokens));
          return { group, rows };
        })
        .filter((entry) => entry.rows.length > 0),
    [groups, modes, tokens],
  );

  const activeRow = useMemo(() => {
    if (!activeTooltip) return null;
    for (const { group, rows } of visible) {
      if (activeCollapsed.includes(group.id)) continue;
      const found = rows.find((item) => item.id === activeTooltip && item.tooltip);
      if (found) return found;
    }
    return null;
  }, [activeTooltip, visible, activeCollapsed]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openTooltip = useCallback(
    (rowId: string) => {
      clearCloseTimer();
      setActiveTooltip(rowId);
    },
    [clearCloseTimer],
  );

  const scheduleClose = useCallback(
    (rowId: string) => {
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        setActiveTooltip((curr) => (curr === rowId ? null : curr));
        closeTimerRef.current = null;
      }, 110);
    },
    [clearCloseTimer],
  );

  const positionTooltip = useCallback(() => {
    if (!activeRow) return;
    const triggerEl = triggerRefs.current.get(activeRow.id);
    const tooltipEl = tooltipRef.current;
    if (!triggerEl || !tooltipEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const theadRect = theadRef.current?.getBoundingClientRect();
    const topBoundary = theadRect && theadRect.bottom > 0 ? Math.max(61, theadRect.bottom) : 61;

    // Close if the trigger scrolls behind the sticky header or outside the viewport.
    if (
      triggerRect.bottom <= topBoundary ||
      triggerRect.top >= viewportH - 8 ||
      triggerRect.right <= 0 ||
      triggerRect.left >= viewportW
    ) {
      setActiveTooltip(null);
      return;
    }

    const tooltipRect = tooltipEl.getBoundingClientRect();
    const gutter = 16;
    const gap = 8;
    const arrowDefaultOffset = 22;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const idealLeft = triggerCenterX - arrowDefaultOffset;
    const maxLeft = Math.max(gutter, viewportW - gutter - tooltipRect.width);
    const left = Math.min(Math.max(idealLeft, gutter), maxLeft);
    const arrowX = Math.min(Math.max(triggerCenterX - left, 14), Math.max(14, tooltipRect.width - 14));

    const spaceBelow = viewportH - triggerRect.bottom - gap - gutter;
    const spaceAbove = triggerRect.top - topBoundary - gap;
    const side: "bottom" | "top" =
      spaceBelow < tooltipRect.height && spaceAbove > spaceBelow ? "top" : "bottom";

    const top =
      side === "bottom"
        ? triggerRect.bottom + gap
        : Math.max(topBoundary + 6, triggerRect.top - tooltipRect.height - gap);

    tooltipEl.dataset.side = side;
    tooltipEl.style.top = `${Math.round(top)}px`;
    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.setProperty("--arrow-x", `${Math.round(arrowX)}px`);
  }, [activeRow]);

  useLayoutEffect(() => {
    if (!activeRow) return;
    positionTooltip();
  }, [activeRow, positionTooltip]);

  useEffect(() => {
    if (!activeRow) return;

    const handleViewportChange = () => positionTooltip();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const triggerEl = triggerRefs.current.get(activeRow.id);
      if (triggerEl?.contains(target) || tooltipRef.current?.contains(target)) return;
      setActiveTooltip(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTooltip(null);
      }
    };

    window.addEventListener("scroll", handleViewportChange, { passive: true, capture: true });
    window.addEventListener("resize", handleViewportChange, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeRow, positionTooltip]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const shown = visible.reduce((sum, entry) => sum + entry.rows.length, 0);
  const toggle = (id: string) => {
    const setter = isSearching ? setSearchCollapsed : setCollapsed;
    setter((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
  };
  const clear = () => {
    setQuery("");
    setSearchCollapsed([]);
  };

  const activeTooltipId = activeRow ? `${uid}-tip-${activeRow.id}` : undefined;

  return (
    <div className={styles.comparison}>
      <div
        className={styles.comparisonViewport}
        role="region"
        aria-label="Access mode feature comparison"
        tabIndex={0}
        onScroll={(event) => {
          event.currentTarget.style.setProperty("--compare-scroll", `${event.currentTarget.scrollLeft}px`);
          if (activeRow) positionTooltip();
        }}
      >
        <table id={`${uid}-table`} className={styles.table}>
          <caption className="visually-hidden">
            Published ATRX access mode capability matrix. O means included, X means unavailable, and Optional means
            the capability can be included depending on the plan.
          </caption>
          <colgroup>
            <col className={styles.labelCol} />
            {modes.map((mode) => (
              <col key={mode.id} />
            ))}
          </colgroup>
          <thead ref={theadRef}>
            <tr>
              <th scope="col" className={styles.corner}>
                <div className={styles.search}>
                  <SearchIcon size={14} />
                  <label htmlFor={`${uid}-search`} className="visually-hidden">
                    Search the comparison
                  </label>
                  <input
                    id={`${uid}-search`}
                    type="search"
                    value={query}
                    placeholder="Search"
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSearchCollapsed([]);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape" && query) {
                        event.preventDefault();
                        clear();
                      }
                    }}
                    aria-controls={`${uid}-table`}
                  />
                  {query ? (
                    <button type="button" className={styles.clearSearch} onClick={clear} aria-label="Clear search">
                      <CloseIcon size={12} />
                    </button>
                  ) : null}
                </div>
              </th>
              {modes.map((mode) => (
                <th key={mode.id} scope="col" className={styles.modeHead}>
                  <span className={styles.modeName}>{mode.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          {shown === 0 ? (
            <tbody>
              <tr>
                <td colSpan={modes.length + 1} className={styles.noMatch}>
                  <p>No features match “{query.trim()}”.</p>
                  <button type="button" className={styles.textButton} onClick={clear}>
                    Clear search
                  </button>
                </td>
              </tr>
            </tbody>
          ) : null}
          {visible.map(({ group, rows }) => {
            const open = !activeCollapsed.includes(group.id);
            const bodyId = `${uid}-${group.id}`;
            return (
              <Fragment key={group.id}>
                <tbody className={styles.groupHead}>
                  <tr>
                    <th scope="colgroup" colSpan={modes.length + 1}>
                      <button
                        type="button"
                        className={styles.groupToggle}
                        aria-expanded={open}
                        aria-controls={bodyId}
                        onClick={() => toggle(group.id)}
                      >
                        <span>{group.title}</span>
                        <ChevronDown size={14} />
                      </button>
                    </th>
                  </tr>
                </tbody>
                <tbody id={bodyId} hidden={!open}>
                  {rows.map((row) => {
                    const badge = statusBadge(row.status);
                    const hasTooltip = Boolean(row.tooltip);
                    const isTooltipOpen = hasTooltip && activeRow?.id === row.id;
                    return (
                      <tr key={row.id} className={styles.row}>
                        <th scope="row" className={styles.rowLabel}>
                          <span className={styles.featureHead}>
                            <span className={styles.featureName}>{row.label}</span>
                            {badge ? (
                              <span
                                className={styles.statusTag}
                                data-status={row.status}
                                title={`Delivery status: ${statusFullLabel(row.status)}`}
                              >
                                {badge}
                              </span>
                            ) : null}
                            {hasTooltip ? (
                              <button
                                ref={(node) => {
                                  if (node) triggerRefs.current.set(row.id, node);
                                  else triggerRefs.current.delete(row.id);
                                }}
                                type="button"
                                className={styles.infoButton}
                                aria-label={`More information about ${row.label}`}
                                aria-describedby={isTooltipOpen ? activeTooltipId : undefined}
                                aria-expanded={isTooltipOpen}
                                onPointerEnter={(event) => {
                                  if (event.pointerType === "mouse") openTooltip(row.id);
                                }}
                                onPointerLeave={(event) => {
                                  if (event.pointerType === "mouse") scheduleClose(row.id);
                                }}
                                onFocus={(event) => {
                                  if (event.currentTarget.matches(":focus-visible")) {
                                    openTooltip(row.id);
                                  }
                                }}
                                onBlur={(event) => {
                                  if (!tooltipRef.current?.contains(event.relatedTarget as Node)) {
                                    setActiveTooltip((curr) => (curr === row.id ? null : curr));
                                  }
                                }}
                                onClick={() => {
                                  clearCloseTimer();
                                  setActiveTooltip((curr) => (curr === row.id ? null : row.id));
                                }}
                              >
                                <InfoIcon size={13} />
                              </button>
                            ) : null}
                          </span>
                        </th>
                        {modes.map((mode) => (
                          <td key={mode.id}>
                            <Cell cell={row.values[mode.id as ModeId]} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </Fragment>
            );
          })}
        </table>
      </div>
      {activeRow && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={tooltipRef}
              id={activeTooltipId}
              role="tooltip"
              className={styles.tooltip}
              data-side="bottom"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") clearCloseTimer();
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") scheduleClose(activeRow.id);
              }}
            >
              <span className={styles.tooltipArrow} aria-hidden="true" />
              <span className={styles.tooltipBody}>{activeRow.description}</span>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
