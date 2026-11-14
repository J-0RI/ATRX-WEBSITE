"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { documentationPanel, primaryNav, requestAccessPanel } from "@/content/nav";
import MenuButton from "./MenuButton";
import MobileNav from "./MobileNav";
import Search, { type SearchState } from "./Search";
import { ChevronDown } from "./Icons";
import { useNavDropdowns } from "./useNavDropdowns";
import styles from "./TopNav.module.css";

/** The bar may never reach closer to the logo than the header's edge inset. */
const LOGO_CLEARANCE = 16;
/** --search-delay (closing) + --search-duration + settle margin, in ms. */
const CLOSE_SETTLE = 420;

export default function TopNav() {
  const pathname = usePathname();
  const dropdowns = useNavDropdowns();
  const [search, setSearch] = useState<SearchState>("closed");
  const searchRef = useRef<SearchState>("closed");
  const restoreFocus = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelHost, setPanelHost] = useState<HTMLDivElement | null>(null);

  /*
   * The search region is measured from the live layout, never assumed. Its right edge is
   * the Search cell's right edge. On desktop it covers exactly the combined footprint of the
   * Request access cell, the seam and the Search cell. Below the rail (where the cells are
   * smaller and Request access may be hidden) it reaches back to the logo's clearance.
   * The logo and menu button are never covered.
   */
  const measure = useCallback(() => {
    const inner = innerRef.current;
    const trigger = triggerRef.current;
    const logo = logoRef.current;
    if (!inner || !trigger || !logo) return;
    const box = inner.getBoundingClientRect();
    const cell = trigger.getBoundingClientRect();
    const center = centerRef.current?.getBoundingClientRect();
    const split = splitRef.current?.getBoundingClientRect();
    const desktop = !!center && center.width > 0;
    const start =
      desktop && split && split.width > 0 ? split.left : logo.getBoundingClientRect().right + LOGO_CLEARANCE;
    const end = cell.right;
    inner.style.setProperty("--search-left", `${start - box.left}px`);
    inner.style.setProperty("--search-width", `${end - start}px`);
    inner.style.setProperty("--search-from-left", `${cell.left - start}px`);
    inner.style.setProperty("--search-from-right", `${end - cell.right}px`);
  }, []);

  useLayoutEffect(() => {
    measure();
    const inner = innerRef.current;
    if (!inner) return;
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    if (triggerRef.current) observer.observe(triggerRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  const commit = useCallback((next: SearchState) => {
    searchRef.current = next;
    setSearch(next);
  }, []);

  const closeDropdowns = dropdowns.close;
  const openSearch = useCallback(() => {
    clearTimeout(settleTimer.current);
    measure();
    closeDropdowns();
    commit("open");
  }, [measure, closeDropdowns, commit]);

  /* "closing" keeps the reverse choreography's delays until it settles; reopening mid-way simply reverses. */
  const closeSearch = useCallback((returnFocus: boolean) => {
    if (searchRef.current !== "open") return;
    clearTimeout(settleTimer.current);
    commit("closing");
    settleTimer.current = setTimeout(() => commit("closed"), CLOSE_SETTLE);
    restoreFocus.current = returnFocus;
  }, [commit]);

  // Once "closing" is committed the trigger is focusable again: hand focus back to it.
  useEffect(() => {
    if (search !== "closing" || !restoreFocus.current) return;
    restoreFocus.current = false;
    triggerRef.current?.focus();
  }, [search]);

  // Route changes never close search: only the X control does (search persistence rule).
  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const searching = search === "open";

  return (
    <header className={styles.header}>
      <div ref={innerRef} className={styles.inner} data-search={search}>
        {/* Left rail, centered logo, right actions: DOM order matches visual and tab order. */}
        <nav ref={centerRef} className={styles.center} aria-label="Global navigation">
          <MenuButton
            id="documentation"
            controller={dropdowns}
            label={
              <>
                Documentation
                <ChevronDown size={14} />
              </>
            }
            panel={documentationPanel}
            host={panelHost}
            size="wide"
            buttonClassName={styles.link}
          />
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${pathname.startsWith(item.href) ? styles.current : ""}`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link ref={logoRef} href="/" className={styles.logo} aria-label="ATRX home">
          {/* Supplied brand asset, rendered at its native 1012:204 ratio. */}
          <img src="/brand/atrx.svg" alt="ATRX" width={84} height={17} />
        </Link>

        <div className={styles.actions}>
          {/* The search bar grows leftward over this cell; it is covered (and inert) while open. */}
          <div ref={splitRef} className={styles.split} inert={searching}>
            <Link href="/contact" className={styles.splitMain}>
              Request access
            </Link>
            <MenuButton
              id="request-access"
              controller={dropdowns}
              label={<ChevronDown size={14} />}
              ariaLabel="More access options"
              panel={requestAccessPanel}
              host={panelHost}
              buttonClassName={styles.splitToggle}
            />
          </div>
          <Search state={search} onOpen={openSearch} onClose={closeSearch} triggerRef={triggerRef} />
          <MobileNav />
        </div>
        {/* Dropdown panels render here: a sibling of the rails, outside the search-morph clip. */}
        <div ref={setPanelHost} className={styles.panels} />
      </div>
    </header>
  );
}
