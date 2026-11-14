import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/content/nav";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on ATRX access and eligibility, market intelligence and coverage, risk and execution, deployment, governance and commercial terms.",
};

/* Category navigation for "On this page". Each id matches a category section below. */
const categories = [
  { id: "access", title: "Access and eligibility" },
  { id: "research", title: "Research and market intelligence" },
  { id: "execution", title: "Risk and execution" },
  { id: "deployment", title: "Deployment and institutional requirements" },
  { id: "commercial", title: "Commercial and support" },
];

export default function FaqPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
      </header>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="On this page">
          <p className={styles.tocTitle}>On this page</p>
          <ol className={styles.tocList}>
            {categories.map((category) => (
              <li key={category.id}>
                <a href={`#${category.id}`} className={styles.tocLink}>
                  {category.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.content}>
          <section id="access" className={styles.section} aria-labelledby="access-heading">
            <h2 id="access-heading" className={styles.categoryTitle}>
              Access and eligibility
            </h2>

            <article id="audience" className={styles.item}>
              <h3 className={styles.question}>Who is ATRX designed for?</h3>
              <div className={styles.answer}>
                <p>
                  ATRX serves systematic allocators, hedge fund and asset management teams,
                  institutional trading desks and qualified quantitative prosumers. Teams use it to
                  evaluate market regimes and macroeconomic transmission within their own risk
                  mandates. See <Link href="/use-cases">Use cases</Link>.
                </p>
              </div>
            </article>

            <article id="access-process" className={styles.item}>
              <h3 className={styles.question}>How is access to ATRX granted?</h3>
              <div className={styles.answer}>
                <p>
                  Access is granted by application during ATRX’s closed deployment phase.
                  Engineering reviews each application against compute capacity and infrastructure
                  alignment, and pricing follows technical qualification. Enterprise engagements
                  complete an architecture sync and paper-trading parallel run before live capital.{" "}
                  <Link href="/contact#request">Submit an application</Link>.
                </p>
              </div>
            </article>

            <article id="modes" className={styles.item}>
              <h3 className={styles.question}>How do the access modes differ?</h3>
              <div className={styles.answer}>
                <p>
                  Prosumer Node serves qualified individual market participants. Capital Desk
                  supports institutional trading teams requiring broader integration and allocation
                  capabilities. Institutional is designed for organizations requiring dedicated
                  infrastructure and governance. See <Link href="/explore#compare">Explore</Link>{" "}
                  for the full comparison.
                </p>
              </div>
            </article>

            <article id="plans" className={styles.item}>
              <h3 className={styles.question}>How do I select a plan?</h3>
              <div className={styles.answer}>
                <p>
                  Each access mode offers two or three plans on <Link href="/explore">Explore</Link>.
                  Select a mode to review its plans and apply from the relevant card; plan
                  allocations are provisional and confirmed during technical qualification.
                </p>
              </div>
            </article>
          </section>

          <section id="research" className={styles.section} aria-labelledby="research-heading">
            <h2 id="research-heading" className={styles.categoryTitle}>
              Research and market intelligence
            </h2>

            <article id="intelligence" className={styles.item}>
              <h3 className={styles.question}>What market intelligence does ATRX provide?</h3>
              <div className={styles.answer}>
                <p>
                  ATRX provides market regime classification, transition probabilities, structural
                  break detection, macro event impact analysis and causal factor attribution, with
                  cross-asset transmission analysis in Capital Desk and Institutional. Every output
                  is grounded in economic transmission mechanisms rather than correlation alone. See{" "}
                  <Link href="/capabilities/market-intelligence">Systemic Macro Intelligence</Link>.
                </p>
              </div>
            </article>

            <article id="coverage" className={styles.item}>
              <h3 className={styles.question}>Which markets and instruments are covered?</h3>
              <div className={styles.answer}>
                <p>
                  Developed FX and Precious Metals were live-traded during Phase 1 validation.
                  Broader currency baskets, equity index topologies and energy vectors are in
                  preparation for v4.0 activation without a published release date, while
                  single-name equities, sovereign rates and volatility remain planned. See{" "}
                  <Link href="/capabilities/market-coverage">Market Coverage</Link>.
                </p>
              </div>
            </article>

            <article id="evaluation" className={styles.item}>
              <h3 className={styles.question}>
                How are research outputs evaluated and documented?
              </h3>
              <div className={styles.answer}>
                <p>
                  Outputs are evaluated post-trade across desk-defined review windows, grouping
                  realized results by regime tag and structural identifier alongside decisions
                  halted by risk controls. Methodology and out-of-sample ablation studies are
                  documented in the whitepaper. See{" "}
                  <Link href="/performance">Phase 1 performance</Link>.
                </p>
              </div>
            </article>
          </section>

          <section id="execution" className={styles.section} aria-labelledby="execution-heading">
            <h2 id="execution-heading" className={styles.categoryTitle}>
              Risk and execution
            </h2>

            <article id="capital" className={styles.item}>
              <h3 className={styles.question}>Does ATRX execute trades or control capital?</h3>
              <div className={styles.answer}>
                <p>
                  No—across the standard access modes, ATRX is non-custodial and delivers
                  directives to your endpoint while you retain control over API keys, sizing,
                  brokerage execution and counterparty risk. A separate Capital Allocation Partner
                  mandate under negotiated limits is available through{" "}
                  <Link href="/partnerships#engagement">Enterprise tenancy</Link>.
                </p>
              </div>
            </article>

            <article id="integration" className={styles.item}>
              <h3 className={styles.question}>
                How does ATRX integrate with existing trading systems?
              </h3>
              <div className={styles.answer}>
                <p>
                  ATRX delivers signed, schema-validated JSON payloads via webhooks and REST API
                  across all modes, with streaming delivery and low-latency execution SDKs in
                  Capital Desk and Institutional. OMS/EMS connectivity is in development and FIX
                  protocol support is planned. See <Link href="/quickstart">Quickstart</Link>.
                </p>
              </div>
            </article>

            <article id="risk-controls" className={styles.item}>
              <h3 className={styles.question}>What risk controls apply to ATRX directives?</h3>
              <div className={styles.answer}>
                <p>
                  Every directive passes through regime gating and the Control protocol, which
                  vetoes exposure breaches and known failure vectors before tenant-side drawdown
                  limits, exposure caps and macro blackout windows apply. These controls govern
                  system behavior and are not a guarantee against loss. See{" "}
                  <Link href="/capabilities/risk-control">Risk &amp; Control</Link>.
                </p>
              </div>
            </article>
          </section>

          <section id="deployment" className={styles.section} aria-labelledby="deployment-heading">
            <h2 id="deployment-heading" className={styles.categoryTitle}>
              Deployment and institutional requirements
            </h2>

            <article id="deployment-options" className={styles.item}>
              <h3 className={styles.question}>What deployment options are available?</h3>
              <div className={styles.answer}>
                <p>
                  ATRX deploys as a single-tenant pipeline (Prosumer Node), a multi-node cohort
                  architecture (Capital Desk) or a dedicated AWS or GCP inference cluster
                  (Institutional). Credentials remain inside the tenant environment, and enterprise
                  deployments validate latency and slippage in paper trading first.
                </p>
              </div>
            </article>

            <article id="dedicated" className={styles.item}>
              <h3 className={styles.question}>
                Does ATRX support dedicated institutional environments?
              </h3>
              <div className={styles.answer}>
                <p>
                  Yes. Institutional provides a dedicated AWS or GCP inference cluster with custom
                  structural modeling and direct engineering support. Private cloud or network
                  connectivity, regional placement and contractual service levels are scoped during
                  technical qualification. See <Link href="/access/institutional">Institutional</Link>.
                </p>
              </div>
            </article>

            <article id="governance" className={styles.item}>
              <h3 className={styles.question}>
                How are permissions, governance and auditability managed?
              </h3>
              <div className={styles.answer}>
                <p>
                  All modes enforce multi-factor authentication, tenant permissions, IP
                  allowlisting, encryption and credential rotation; role-based access control is in
                  development and single sign-on is planned. Decision logs and risk vetoes export in
                  machine-readable formats, with audit-grade telemetry in Institutional (describing
                  record completeness, not regulatory certification). See{" "}
                  <Link href="/delivery/audit-grade-ledgers">Audit-Grade Ledgers</Link>.
                </p>
              </div>
            </article>
          </section>

          <section id="commercial" className={styles.section} aria-labelledby="commercial-heading">
            <h2 id="commercial-heading" className={styles.categoryTitle}>
              Commercial and support
            </h2>

            <article id="pricing" className={styles.item}>
              <h3 className={styles.question}>How is ATRX priced?</h3>
              <div className={styles.answer}>
                <p>
                  Commercial terms are shared after technical qualification: a monthly compute fee
                  for Prosumer Node, base plus capacity for Capital Desk, and custom terms for
                  Institutional. Admission remains subject to available compute capacity.
                </p>
              </div>
            </article>

            <article id="institutional-request" className={styles.item}>
              <h3 className={styles.question}>How do we request institutional access?</h3>
              <div className={styles.answer}>
                <p>
                  Submit an{" "}
                  <Link href="/contact?engagement=tier-3#request">Institutional application</Link>{" "}
                  outlining your deployment scope, infrastructure environment, integration
                  requirements and governance objectives. Qualified engagements proceed directly to
                  an engineering architecture review.
                </p>
              </div>
            </article>

            <article id="documentation" className={styles.item}>
              <h3 className={styles.question}>Where can I find technical documentation?</h3>
              <div className={styles.answer}>
                <p>
                  Visit <Link href="/documentation">Documentation</Link> for system architecture,
                  methodology, Phase 1 validation metrics and risk disclosures, or{" "}
                  <Link href="/quickstart">Quickstart</Link> for payload integration. Full
                  whitepaper and ablation study PDFs are available via{" "}
                  <Link href="/contact?engagement=documentation#request">
                    documentation request
                  </Link>
                  .
                </p>
              </div>
            </article>

            <article id="contact" className={styles.item}>
              <h3 className={styles.question}>How can I contact the ATRX team?</h3>
              <div className={styles.answer}>
                <p>
                  Submit access or documentation inquiries through the{" "}
                  <Link href="/contact">contact page</Link>, or email{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> for direct technical
                  questions.
                </p>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
