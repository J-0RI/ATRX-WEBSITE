"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { LocalSection } from "@/content/nav";
import { ChevronDown } from "./Icons";
import Sidebar, { useActiveItem } from "./Sidebar";
import styles from "./SectionMenu.module.css";

/** Below the desktop breakpoint the local sidebar collapses into this in-page section menu. */
export default function SectionMenu({ section }: { section: LocalSection }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const { isActive } = useActiveItem(section);
  const current = section.groups.flatMap((g) => g.items).find((i) => isActive(i.href));

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className={styles.menu}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.label}>
          {section.label}
          {section.badge ? <span className={styles.badge}>{section.badge}</span> : null}
        </span>
        {current ? <span className={styles.current}>{current.label}</span> : null}
        <ChevronDown size={14} className={styles.chevron} />
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        <Sidebar section={section} showHeader={false} className={styles.list} onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
