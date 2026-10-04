"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { documentationMenu, primaryNav, requestAccessMenu, type NavItem } from "@/content/nav";
import { CloseIcon, MenuIcon } from "./Icons";
import styles from "./MobileNav.module.css";

/**
 * Below the desktop breakpoint the global navigation moves into a modal drawer.
 * It carries global destinations only; local section links stay in each page's SectionMenu.
 */
export default function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1180px)");
    const onChange = () => mq.matches && close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current?.showModal();
          closeRef.current?.focus();
        }}
      >
        <MenuIcon />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.drawer}
        aria-label="Global navigation"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.head}>
            <button ref={closeRef} type="button" className={styles.close} aria-label="Close navigation" onClick={close}>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Global navigation">
            <Group title="Documentation" items={documentationMenu} onNavigate={close} />
            <ul className={styles.primary}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} aria-current={pathname === item.href ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Group title="Request access" items={requestAccessMenu} onNavigate={close} />
          </nav>
        </div>
      </dialog>
    </>
  );
}

function Group({ title, items, onNavigate }: { title: string; items: NavItem[]; onNavigate: () => void }) {
  return (
    <div className={styles.group}>
      <p className={styles.groupTitle}>{title}</p>
      <ul className={styles.groupList}>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
