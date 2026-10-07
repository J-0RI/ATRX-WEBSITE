import type { Metadata } from "next";
import Link from "next/link";
import { DocHeader, DocSection, EntryList, Note } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Technical library for evaluators: whitepapers, reports and disclosures.",
};

const library = [
  { code: "W-01", title: "Systemic Macro Intelligence", body: "Structural inference, state gating, and the dynamic router.", href: "/architecture" },
  { code: "E-01", title: "Structural Philosophy", body: "Alpha decay, causal reflexivity, and the self-compiling network.", href: "/philosophy" },
  { code: "P-01", title: "Phase 1 Validation Metrics", body: "Q1 2026 · Sharpe 2.19 · Live execution ablation study.", href: "/performance" },
  { code: "P-02", title: "Enterprise Tenancy", body: "Distributed execution, API architecture, and capital scaling.", href: "/partnerships" },
  { code: "D-01", title: "Risk Protocol & Disclosure", body: "Algorithmic latency, structural decay, and execution limits.", href: "/risk" },
];

export default function DocumentationPage() {
  return (
    <>
      <DocHeader title="Technical library for evaluators.">
        <p>
          The materials below are maintained for qualified quantitative evaluators and capital
          allocators. The technical whitepaper provides deep structural insight into the
          architecture and the live production metrics.
        </p>
      </DocHeader>

      <DocSection id="library" title="Library">
        <EntryList
          mono
          entries={library.map((doc) => ({
            label: doc.code,
            body: (
              <>
                <Link href={doc.href}>
                  {doc.title}
                </Link>
                <br />
                {doc.body} · Web
              </>
            ),
          }))}
        />
        <Note>
          PDF editions of the whitepaper and ablation studies are released to qualified evaluators on
          request. <Link href="/contact?engagement=documentation#request">Request technical documentation</Link>.
        </Note>
      </DocSection>
    </>
  );
}
