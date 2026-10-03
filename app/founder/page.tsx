import type { Metadata } from "next";
import Link from "next/link";
import { Actions, DocHeader, DocSection, EntryList } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Founder",
  description: "Timilehin Olapade, Founder and Lead Quantitative Engineer of ATRX.",
};

export default function FounderPage() {
  return (
    <>
      <DocHeader eyebrow="Founder & Lead Quantitative Engineer" title="Timilehin Olapade">
        <p>
          Timilehin Olapade is the Founder and Lead Quantitative Engineer of ATRX, where he
          architects the platform&apos;s proprietary execution framework and deterministic routing
          pipelines.
        </p>
        <p>
          His background bridges advanced financial engineering, statistical learning, and
          low-latency systems development, supported by postgraduate research in stochastic
          calculus and deep learning for finance at WorldQuant University. He holds an undergraduate
          degree in Business Administration, graduating in the top 1% of his cohort as Best
          Graduating Student.
        </p>
        <p>
          ATRX is the culmination of his research into formal causal inference and high-frequency
          regime mapping, focused on engineering proprietary inference pipelines for structural
          capital routing.
        </p>
      </DocHeader>

      <Actions>
        <Link href="/contact" className="btn btn-secondary">
          Contact engineering
        </Link>
      </Actions>

      <DocSection id="background" title="Background">
        <EntryList
          entries={[
            {
              label: "Current · ATRX",
              body: "Founder and Lead Quantitative Engineer. Sole architect of the platform's core infrastructure.",
            },
            { label: "Academic", body: "M.Sc. Financial Engineering · WorldQuant University." },
            {
              label: "Undergraduate",
              body: "Business Administration · Top 1% of class, Best Graduating Student.",
            },
          ]}
        />
      </DocSection>
    </>
  );
}
