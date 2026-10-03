import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
import styles from "./shell.module.css";
import "./globals.css";

const aeonik = localFont({
  src: "./fonts/AeonikExtendedProVF.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-aeonik",
  adjustFontFallback: "Arial",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atrx.tech"),
  title: {
    default: "ATRX | Autonomous quantitative infrastructure",
    template: "%s | ATRX",
  },
  description:
    "ATRX is autonomous quantitative infrastructure built to combat alpha decay through systemic macro intelligence, disciplined risk controls, and execution precision.",
  applicationName: "ATRX",
  authors: [{ name: "Haldane Technologies Inc" }],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={aeonik.variable}>
      <body>
        {/* Pages always open at the top unless the URL carries an anchor. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{history.scrollRestoration='manual'}catch(e){}",
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <TopNav />
        <div className={styles.shell}>
          <aside className={styles.rail} aria-label="Documentation">
            <Sidebar />
          </aside>
          <main id="main" className={styles.main}>
            <div className={styles.content}>
              {children}
              <Footer />
            </div>
          </main>
        </div>
        <ScrollManager />
      </body>
    </html>
  );
}
