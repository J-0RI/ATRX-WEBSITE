"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { documentationMenu, primaryNav, requestAccessMenu } from "@/content/nav";
import MenuButton from "./MenuButton";
import MobileNav from "./MobileNav";
import Search, { type SearchState } from "./Search";
import { ChevronDown } from "./Icons";
import { useNavDropdowns } from "./useNavDropdowns";
import styles from "./TopNav.module.css";

/** Below the desktop rail the bar may not reach closer to the logo than the header's edge inset. */
const LOGO_CLEARANCE = 16;
/** Matches the narrow header where the bar also spans the Request access cell. */
const NARROW_QUERY = "(max-width: 520px)";
/** --search-delay (closing) + --search-duration + settle margin, in ms. */
const CLOSE_SETTLE = 420;

export default function TopNav() {
  const pathname = usePathname();
  const dropdowns = useNavDropdowns();
  const [search, setSearch] = useState<SearchState>("closed");
  const searchRef = useRef<SearchState>("closed");
  const restoreFocus = useRef(false);
  const [narrow, setNarrow] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * The search region is measured from the live layout, never assumed:
   * desktop = the shells left of Search through the Search cell;
   * below the rail = from the logo's clearance to the Search cell;
   * narrow = additionally across the Request access cell (never the menu or logo).
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
    const isNarrow = window.matchMedia(NARROW_QUERY).matches;
    const start = center && center.width > 0 ? center.left : logo.getBoundingClientRect().right + LOGO_CLEARANCE;
    const end = isNarrow && split && split.width > 0 ? split.right : cell.right;
    inner.style.setProperty("--search-left", `${start - box.left}px`);
    inner.style.setProperty("--search-width", `${end - start}px`);
    inner.style.setProperty("--search-from-left", `${cell.left - start}px`);
    inner.style.setProperty("--search-from-right", `${end - cell.right}px`);
    setNarrow(isNarrow);
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
        <Link ref={logoRef} href="/" className={styles.logo} aria-label="ATRX home">
          {/* Supplied brand asset, rendered at its native 1012:204 ratio. */}
          <img src="/brand/atrx.svg" alt="ATRX" width={84} height={17} />
        </Link>

        <nav ref={centerRef} className={styles.center} aria-label="Global navigation" inert={searching}>
          <MenuButton
            id="documentation"
            controller={dropdowns}
            label={
              <>
                Documentation
                <ChevronDown size={14} />
              </>
            }
            items={documentationMenu}
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

        <div className={styles.actions}>
          <Search state={search} onOpen={openSearch} onClose={closeSearch} triggerRef={triggerRef} />
          <div ref={splitRef} className={styles.split} inert={searching && narrow}>
            <Link href="/contact" className={styles.splitMain}>
              Request access
            </Link>
            <MenuButton
              id="request-access"
              controller={dropdowns}
              label={<ChevronDown size={14} />}
              ariaLabel="More access options"
              items={requestAccessMenu}
              buttonClassName={styles.splitToggle}
              align="end"
            />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
