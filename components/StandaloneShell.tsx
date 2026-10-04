import styles from "./Shell.module.css";

/** Focused single-purpose pages: no local navigation, no reserved rail column. */
export default function StandaloneShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className={styles.standalone}>
      <div className={styles.content} data-shell="standalone">
        {children}
      </div>
    </main>
  );
}
