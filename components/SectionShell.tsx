import type { LocalSection } from "@/content/nav";
import SectionMenu from "./SectionMenu";
import Sidebar from "./Sidebar";
import styles from "./Shell.module.css";

/** Domain shell: local sidebar for the current section + bounded content canvas. */
export default function SectionShell({ section, children }: { section: LocalSection; children: React.ReactNode }) {
  return (
    <div className={styles.shell} data-shell="section">
      <div className={styles.rail}>
        <div className={styles.railViewport} data-sidebar-viewport tabIndex={0} role="region" aria-label={`${section.label} index`}>
          <Sidebar section={section} />
        </div>
      </div>
      <main id="main" className={styles.main}>
        <div className={styles.content}>
          <SectionMenu section={section} />
          {children}
        </div>
      </main>
    </div>
  );
}
