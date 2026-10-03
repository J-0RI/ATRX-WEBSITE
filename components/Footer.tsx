import Link from "next/link";
import { LINKEDIN_URL } from "@/content/nav";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Haldane Technologies Inc</p>
      <ul className={styles.links}>
        <li>
          <Link href="/risk">Risk Disclosure</Link>
        </li>
        <li>
          <Link href="/performance">Historical Performance</Link>
        </li>
        <li>
          <Link href="/contact?engagement=documentation">Documentation Request</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      </ul>
    </footer>
  );
}
