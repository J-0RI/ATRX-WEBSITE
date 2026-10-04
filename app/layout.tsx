import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
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
        {/* Each route group supplies its shell: a domain sidebar shell or the standalone shell. */}
        {children}
        {/* One global footer, after every shell: below both the sidebar and the main column. */}
        <Footer />
        <ScrollManager />
      </body>
    </html>
  );
}
