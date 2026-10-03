import type { Metadata } from "next";
import { DocHeader, DocSection, Note, Prose, Related } from "@/components/Doc";
import styles from "./performance.module.css";

export const metadata: Metadata = {
  title: "Phase 1 Performance",
  description:
    "Phase 1 validation metrics, Q1 2026. Historical validation data does not guarantee future operational yield.",
};

const metrics = [
  { value: "2.19", label: "Sharpe Ratio" },
  { value: "1.84", label: "Profit Factor" },
  { value: "< 8.4%", label: "Maximum Drawdown" },
  { value: "109", label: "Causal Transmission Paths" },
  { value: "v4.0", label: "Core Architecture" },
];

const paths = [
  { id: "VEC-MET-01", topology: "Precious Metals Vector", gate: "High-Vol Regime Gate", capture: "84.2%" },
  { id: "VEC-FX-EUR", topology: "Developed FX Vector", gate: "Directional Bias Filter", capture: "79.1%" },
  { id: "VEC-FX-JPY", topology: "Developed FX Vector", gate: "Rate Divergence Lock", capture: "91.5%" },
];

export default function PerformancePage() {
  return (
    <>
      <DocHeader eyebrow="Phase 1 · Q1 2026 Validation" title="Phase 1 performance metrics.">
        <p>
          The metrics below validate the overarching systemic architecture during its live
          production deployment.
        </p>
      </DocHeader>

      <dl className={styles.metrics}>
        {metrics.map((m) => (
          <div key={m.label} className={styles.metric}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      <Note>
        Phase 1 was conducted in a live-data execution environment. Historical validation data does
        not guarantee future operational yield.
      </Note>

      <DocSection id="paths" title="By topology · validated paths">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Path ID</th>
                <th scope="col">Topology</th>
                <th scope="col">State Gate</th>
                <th scope="col" className={styles.num}>
                  Capture Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {paths.map((p) => (
                <tr key={p.id}>
                  <th scope="row">
                    <code>{p.id}</code>
                  </th>
                  <td>{p.topology}</td>
                  <td>{p.gate}</td>
                  <td className={styles.num}>{p.capture}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>
          Topological breakdowns reflect active structural reallocations executed during the Q1 2026
          window. Full ablation studies are available in the technical whitepaper.
        </Note>
      </DocSection>

      <DocSection id="verification" title="Verification & risk">
        <Prose>
          <p>
            Phase 1 was conducted in a live-data execution environment. Out-of-sample ablation
            studies comparing the system against standard correlation baselines are available to
            qualified allocators. Historical validation data does not guarantee future operational
            yield.
          </p>
        </Prose>
      </DocSection>

      <Related
        links={[
          { label: "Risk disclosure", href: "/risk" },
          { label: "Request ablation studies", href: "/contact?engagement=documentation" },
          { label: "System architecture", href: "/architecture" },
        ]}
      />
    </>
  );
}
