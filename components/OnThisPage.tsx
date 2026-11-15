"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./OnThisPage.module.css";

export type OnThisPageSection = {
  /** Stable element id of the section on the current page; also its URL fragment. */
  id: string;
  label: string;
};

type OnThisPageProps = {
  sections: readonly OnThisPageSection[];
  /** Visible heading and accessible name of the navigation. */
  title?: string;
  /**
   * Opt into sticky positioning. The page controls when it applies through
   * `--on-this-page-position` (sticky | static), `--on-this-page-top` and
   * `--on-this-page-max-height` set on the className element.
   */
  sticky?: boolean;
  className?: string;
};

/* Matches the global `[id] { scroll-margin-top: calc(var(--nav-h) + 24px) }`, so a section
 * reached by anchor lands exactly on the line where it becomes the active section. */
const READING_LINE_GAP = 24;
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

/**
 * ATRX "On this page": one continuous neutral rail with a single accent marker. The
 * active section is derived from the supplied sections only.
 *
 * Active state (one source, shared by the marker and the label):
 * - Scrolling: an IntersectionObserver band from the reading line (below the fixed navbar)
 *   to 60% of the viewport. The first section in document order that occupies the band is
 *   active, so a section stays active until its end passes the reading line and a small
 *   fragment of the next section never steals it. At the end of the document the last
 *   section is active (checked only while the last section is on screen).
 * - Deliberate navigation (click, direct link, back/forward): the targeted section is
 *   active at once and held until the visitor scrolls themselves (wheel, touch, scroll
 *   keys, pointer), so the band never flickers through intermediate sections.
 */
export default function OnThisPage({
  sections,
  title = "On this page",
  sticky = false,
  className,
}: OnThisPageProps) {
  // Unset until mounted, so the label and the marker always appear together.
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRef = useRef(activeId);
  const heldRef = useRef(false);
  const railRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const labelRefs = useRef(new Map<string, HTMLSpanElement>());

  const activate = useCallback((id: string) => {
    if (activeRef.current === id) return;
    activeRef.current = id;
    setActiveId(id);
  }, []);

  const sectionKey = sections.map((section) => section.id).join("|");

  /* Scroll observation, deliberate navigation and its release. */
  useEffect(() => {
    const elements = sectionKey
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const ids = elements.map((element) => element.id);
    const lastId = ids[ids.length - 1];
    const inBand = new Set<string>();
    let lastOnScreen = false;

    const atDocumentEnd = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const resolve = () => {
      if (heldRef.current) return;
      if (lastOnScreen && atDocumentEnd()) {
        activate(lastId);
        return;
      }
      const first = ids.find((id) => inBand.has(id));
      // Between sections (or above the first) the current section is kept.
      if (first) activate(first);
      else if (activeRef.current === null) activate(ids[0]);
    };

    /* Reading band. Rebuilt only when the viewport height changes. */
    let band: IntersectionObserver | null = null;
    let bandHeight = 0;
    const buildBand = () => {
      if (window.innerHeight === bandHeight) return;
      bandHeight = window.innerHeight;
      band?.disconnect();
      inBand.clear();
      const navHeight =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
      const top = navHeight + READING_LINE_GAP;
      // Band ends at 60% of the viewport, but always stays at least 48px tall.
      const bottom = Math.max(0, Math.min(bandHeight * 0.4, bandHeight - top - 48));
      band = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target.id);
            else inBand.delete(entry.target.id);
          }
          resolve();
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px` },
      );
      for (const element of elements) band.observe(element);
    };
    buildBand();

    /* End of document: a passive check that exists only while the last section is visible. */
    let endFrame = 0;
    const onScrollNearEnd = () => {
      if (endFrame) return;
      endFrame = requestAnimationFrame(() => {
        endFrame = 0;
        resolve();
      });
    };
    const end = new IntersectionObserver((entries) => {
      const visible = entries[entries.length - 1].isIntersecting;
      if (visible === lastOnScreen) return;
      lastOnScreen = visible;
      if (visible) window.addEventListener("scroll", onScrollNearEnd, { passive: true });
      else window.removeEventListener("scroll", onScrollNearEnd);
      resolve();
    });
    end.observe(elements[elements.length - 1]);

    /* Deliberate navigation: direct links on load, back/forward and fragment changes. */
    const syncToHash = (event?: HashChangeEvent) => {
      const fragment = decodeURIComponent(window.location.hash.slice(1));
      const target = fragment ? document.getElementById(fragment) : null;
      const owner = target ? elements.find((element) => element.contains(target)) : undefined;
      if (owner && target) {
        heldRef.current = true;
        activate(owner.id);
        // History traversal does not scroll (scrollRestoration is manual); bring the
        // section to its anchor position so the page and the navigation agree. A
        // click has already scrolled there, so this is then a no-op.
        if (event) target.scrollIntoView({ block: "start" });
      } else {
        heldRef.current = false;
        resolve();
      }
    };
    syncToHash();

    /* The visitor scrolling themselves hands control back to the reading band. */
    const release = () => {
      if (!heldRef.current) return;
      heldRef.current = false;
      resolve();
    };
    const releaseOnKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) release();
    };

    let resizeFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(buildBand);
    };

    window.addEventListener("hashchange", syncToHash);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("pointerdown", release, { passive: true });
    window.addEventListener("keydown", releaseOnKey);
    window.addEventListener("resize", onResize);

    return () => {
      band?.disconnect();
      end.disconnect();
      cancelAnimationFrame(endFrame);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("scroll", onScrollNearEnd);
      window.removeEventListener("hashchange", syncToHash);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", releaseOnKey);
      window.removeEventListener("resize", onResize);
    };
  }, [sectionKey, activate]);

  /* Marker geometry follows the active label's text block (one or more lines). */
  const placeMarker = useCallback((animate: boolean) => {
    const marker = markerRef.current;
    const label = activeRef.current ? labelRefs.current.get(activeRef.current) : undefined;
    if (!marker) return;
    if (!label) {
      marker.hidden = true;
      return;
    }
    const first = marker.hidden;
    marker.hidden = false;
    if (!animate || first) marker.style.transition = "none";
    marker.style.transform = `translateY(${label.offsetTop}px)`;
    marker.style.height = `${label.offsetHeight}px`;
    if (!animate || first) {
      void marker.offsetHeight; // commit the instant placement before restoring transitions
      marker.style.transition = "";
    }
  }, []);

  useLayoutEffect(() => {
    placeMarker(true);
  }, [activeId, placeMarker]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    // Wrapping can change with width or font loading; re-place without animating.
    const observer = new ResizeObserver(() => placeMarker(false));
    observer.observe(rail);
    return () => observer.disconnect();
  }, [placeMarker]);

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    // Reflect the selection immediately; the native fragment navigation does the rest.
    heldRef.current = true;
    activate(id);
  };

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-sticky={sticky || undefined}
      aria-label={title}
    >
      <p className={styles.title}>{title}</p>
      <div ref={railRef} className={styles.rail}>
        <span ref={markerRef} className={styles.marker} aria-hidden="true" hidden />
        <ol className={styles.list}>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={styles.link}
                aria-current={section.id === activeId ? "location" : undefined}
                onClick={(event) => onLinkClick(event, section.id)}
              >
                <span
                  ref={(node) => {
                    if (node) labelRefs.current.set(section.id, node);
                    else labelRefs.current.delete(section.id);
                  }}
                  className={styles.label}
                >
                  {section.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
