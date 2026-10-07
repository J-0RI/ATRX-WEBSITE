"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { NavItem } from "@/content/nav";
import type { NavDropdowns } from "./useNavDropdowns";
import styles from "./MenuButton.module.css";

type Props = {
  id: string;
  controller: NavDropdowns;
  label: React.ReactNode;
  ariaLabel?: string;
  items: NavItem[];
  buttonClassName?: string;
  align?: "start" | "end";
};

/**
 * Disclosure-style navigation menu. Trigger and panel form one pointer region;
 * hover intent, click/tap, Esc, outside click and Tab-away share one controller.
 */
export default function MenuButton({ id, controller, label, ariaLabel, items, buttonClassName, align = "start" }: Props) {
  const open = controller.openId === id;
  const { close } = controller;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  const focusItem = (index: number) => {
    const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links?.length) return;
    links[(index + links.length) % links.length].focus();
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(id);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, close, id]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(id);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        controller.open(id, "keyboard");
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
      onPointerEnter={(e) => controller.pointerEnter(id, e)}
      onPointerLeave={(e) => controller.pointerLeave(id, e, rootRef.current)}
      onBlur={(e) => {
        if (open && !rootRef.current?.contains(e.relatedTarget as Node)) close(id);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => controller.toggle(id)}
      >
        {label}
      </button>
      <ul
        ref={listRef}
        id={menuId}
        className={`${styles.menu} ${align === "end" ? styles.end : ""}`}
        data-open={open || undefined}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={styles.item} onClick={() => close(id)}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
