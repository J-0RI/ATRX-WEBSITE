"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { primaryNav } from "@/content/nav";
import Sidebar from "./Sidebar";
import { CloseIcon, MenuIcon } from "./Icons";
import styles from "./MobileNav.module.css";

/** Below the desktop breakpoint the sidebar moves into a modal drawer. */
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
        aria-label="Site navigation"
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
          <ul className={styles.primary}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Sidebar onNavigate={close} />
        </div>
      </dialog>
    </>
  );
}
