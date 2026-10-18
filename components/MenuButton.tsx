"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavPanel } from "@/content/nav";
import { ChevronRight } from "./Icons";
import type { NavDropdowns } from "./useNavDropdowns";
import styles from "./MenuButton.module.css";

type Props = {
  id: string;
  controller: NavDropdowns;
  label: React.ReactNode;
  ariaLabel?: string;
  panel: NavPanel;
  /** Header layer the panel is portalled into, so the nav rail's search clip never crops it. */
  host: HTMLElement | null;
  buttonClassName?: string;
  /** Each category keeps its own proportions. */
  size?: "wide" | "standard";
};

/** Row for the current route; hash/query destinations never claim it. */
const routeIndex = (items: NavPanel["items"], pathname: string) => items.findIndex((item) => item.href === pathname);

/** First visible, focusable element after the trigger in document order, outside the panel. */
function nextTabbable(root: HTMLElement | null, panel: HTMLElement | null) {
  if (!root) return null;
  const candidates = document.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])");
  return Array.from(candidates).find(
    (el) =>
      root.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING &&
      !root.contains(el) &&
      !panel?.contains(el) &&
      !el.closest("[inert]") &&
      el.getClientRects().length > 0 &&
      getComputedStyle(el).visibility !== "hidden",
  ) ?? null;
}

/**
 * Disclosure-style navigation panel. Trigger and panel form one pointer region
 * (the portal stays inside the trigger's React tree); hover intent, click/tap,
 * Esc, outside click and Tab-away share one controller. Rows drive one stable
 * preview: hovering or focusing a row selects it, leaving a row keeps it.
 */
export default function MenuButton({ id, controller, label, ariaLabel, panel, host, buttonClassName, size = "standard" }: Props) {
  const open = controller.openId === id;
  const { close } = controller;
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const current = routeIndex(panel.items, pathname);
  const [active, setActive] = useState(Math.max(current, 0));

  const rows = () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  const focusItem = (index: number) => {
    const links = rows();
    if (links.length) links[(index + links.length) % links.length].focus();
  };

  /* Centred on its trigger, shifted only as far as needed to stay inside the header gutters. */
  const place = useCallback(() => {
    const el = panelRef.current;
    const trigger = buttonRef.current;
    if (!el || !trigger || !host) return;
    const box = host.getBoundingClientRect();
    const cell = trigger.getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(host.parentElement ?? host).paddingLeft) || 16;
    const viewport = document.documentElement.clientWidth;
    const width = el.offsetWidth;
    const ideal = cell.left + cell.width / 2 - width / 2;
    const left = Math.min(Math.max(ideal, gutter), viewport - gutter - width);
    el.style.left = `${left - box.left}px`;
  }, [host]);

  useLayoutEffect(() => {
    if (!host) return;
    place();
    const observer = new ResizeObserver(place);
    observer.observe(host);
    document.fonts?.ready.then(place);
    return () => observer.disconnect();
  }, [host, place]);

  // Every opening starts from a deliberate selection: the current route, else the first row.
  useLayoutEffect(() => {
    if (!open) return;
    place();
    setActive(Math.max(current, 0));
  }, [open, current, place]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) close(id);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close, id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const links = rows();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(id);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        controller.open(id, "keyboard");
        requestAnimationFrame(() => focusItem(0));
      } else focusItem(index + 1);
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      focusItem(index <= 0 ? links.length - 1 : index - 1);
    } else if (e.key === "Tab" && open && links.length) {
      // The panel lives in the header's panel layer, so Tab order is routed as if it followed its trigger.
      if (document.activeElement === buttonRef.current && !e.shiftKey) {
        e.preventDefault();
        focusItem(0);
      } else if (index === 0 && e.shiftKey) {
        e.preventDefault();
        buttonRef.current?.focus();
      } else if (index === links.length - 1 && !e.shiftKey) {
        e.preventDefault();
        close(id);
        nextTabbable(rootRef.current, panelRef.current)?.focus();
      }
    }
  };

  const inRegion = (node: Node | null) =>
    !!node && (!!rootRef.current?.contains(node) || !!panelRef.current?.contains(node));

  const surface = (
    <div
      ref={panelRef}
      id={panelId}
      className={styles.panel}
      data-size={size}
      data-open={open || undefined}
      data-handoff={controller.handoff || undefined}
    >
      <div className={styles.navColumn}>
        <p className={styles.title}>{panel.title}</p>
        <p className={styles.intro}>{panel.intro}</p>
        <ul className={styles.rows}>
          {panel.items.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.row}
                data-active={i === active || undefined}
                aria-current={i === current ? "page" : undefined}
                aria-describedby={`${panelId}-d${i}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => close(id)}
              >
                <span className={styles.thumb} aria-hidden="true">
                  <img src={`/nav-art/${item.art}.svg`} alt="" width={600} height={380} />
                </span>
                <span className={styles.rowLabel}>{item.label}</span>
                <ChevronRight size={14} className={styles.rowArrow} />
              </Link>
            </li>
          ))}
        </ul>
        {panel.parent && (
          <Link href={panel.parent.href} className={`arrow-action ${styles.parent}`} onClick={() => close(id)}>
            <span>{panel.parent.label}</span>
            <ChevronRight size={14} className="arrow-action-icon" />
          </Link>
        )}
      </div>

      {/* One stage: every illustration and caption is stacked in place, only opacity changes. */}
      <div className={styles.preview} aria-hidden="true">
        <div className={styles.stage}>
          {panel.items.map((item, i) => (
            <img
              key={item.href}
              className={styles.art}
              data-active={i === active || undefined}
              src={`/nav-art/${item.art}.svg`}
              alt=""
              width={600}
              height={380}
            />
          ))}
        </div>
        <div className={styles.captions}>
          {panel.items.map((item, i) => (
            <div key={item.href} className={styles.caption} data-active={i === active || undefined}>
              <p className={styles.captionTitle}>{item.label}</p>
              <p id={`${panelId}-d${i}`} className={styles.captionText}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => controller.pointerEnter(id, e)}
      onPointerLeave={(e) => controller.pointerLeave(id, e, [rootRef.current, panelRef.current])}
      onBlur={(e) => {
        if (open && !inRegion(e.relatedTarget as Node | null)) close(id);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={ariaLabel}
        onClick={() => controller.toggle(id)}
      >
        {label}
      </button>
      {host && createPortal(surface, host)}
    </div>
  );
}
