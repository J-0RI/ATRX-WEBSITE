"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/content/nav";
import styles from "./MenuButton.module.css";

type Props = {
  label: React.ReactNode;
  ariaLabel?: string;
  items: NavItem[];
  buttonClassName?: string;
  align?: "start" | "end";
};

/** Disclosure-style navigation menu: Esc, outside click and Tab-away close it. */
export default function MenuButton({ label, ariaLabel, items, buttonClassName, align = "start" }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  const focusItem = (index: number) => {
    const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links?.length) return;
    links[(index + links.length) % links.length].focus();
  };

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => focusItem(0));
      } else focusItem(current + 1);
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      focusItem(current <= 0 ? links.length - 1 : current - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (open && !rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      <ul
        ref={listRef}
        id={menuId}
        className={`${styles.menu} ${align === "end" ? styles.end : ""}`}
        hidden={!open}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.item} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
