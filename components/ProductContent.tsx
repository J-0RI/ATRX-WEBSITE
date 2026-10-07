import type { CodeSample } from "@/content/code";
import { quickstart } from "@/content/code";
import { tokenize } from "@/lib/highlight";
import CodeTabs from "./CodeTabs";
import { Note } from "./Doc";
import styles from "./ProductContent.module.css";

/** Reuse the approved tenant-side examples without publishing a new API contract. */
export function ProductExample({ category, samples, label }: { category?: string; samples?: CodeSample[]; label: string }) {
  const source = samples ?? quickstart.find((item) => item.id === category)?.samples;
  if (!source) throw new Error(`Missing approved example: ${category}`);
  return <div className={styles.example}>
    <CodeTabs label={label} samples={source.map(({ lang, ...sample }) => ({ ...sample, lines: tokenize(sample.code, lang) }))} />
    <Note>Illustrative tenant-side integration pattern. Verification parameters, payload schema and export fields are supplied or confirmed during onboarding. Helper functions represent your integration; these examples are not a published SDK or a complete runnable implementation.</Note>
  </div>;
}

/** A semantic sequence for a real product workflow, not an ornamental diagram. */
export function ProductSteps({ steps }: { steps: { title: string; body: React.ReactNode }[] }) {
  return <ol className={styles.steps}>{steps.map((step) => <li key={step.title}><h3>{step.title}</h3><div>{step.body}</div></li>)}</ol>;
}
