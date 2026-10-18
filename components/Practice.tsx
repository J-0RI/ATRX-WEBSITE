"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { onTabListKeyDown } from "./tabs";
import { monitoredTopics, research, riskReview, savedBriefs } from "./PracticeData";
import styles from "./Practice.module.css";

/*
 * ATRX in practice — layered product showcase.
 * One artwork-backed stage; per function a compact context window (why the work matters)
 * and a larger, cropped ATRX software window. Each view has its own task-specific anatomy.
 * Fixtures in PracticeData.ts are illustrative; no live data, external citations or execution.
 */

type Composition = {
  name: string;
  tone: "sage" | "slate" | "stone" | "moss";
  layout: "chartLeft" | "docRight" | "reviewLeft" | "recordRight";
  context: { body: string; task: string; inputs: string[] };
};

const compositions: Composition[] = [
  {
    name: "Market monitoring",
    tone: "sage",
    layout: "chartLeft",
    context: {
      body: "Follow market developments, then read them against the economic conditions around them.",
      task: "A desk needs to separate a policy signal from the developments that still need confirmation.",
      inputs: ["Policy guidance", "Development log"],
    },
  },
  {
    name: "Macro research",
    tone: "slate",
    layout: "docRight",
    context: {
      body: "Frame a question about policy and economic developments, then test whether a transmission mechanism explains the cross-market move.",
      task: "Assess a change in the expected policy path. Record what the evidence supports and what remains open.",
      inputs: ["Research request", "Policy notes", "Market context"],
    },
  },
  {
    name: "Risk review",
    tone: "stone",
    layout: "reviewLeft",
    context: {
      body: "Evaluate prevailing conditions and the desk’s mandate before anything proceeds. A blackout veto stops the review.",
      task: "An FX assessment lands inside the desk’s policy window. Which checks ran, and why did it stop?",
      inputs: ["Desk mandate", "Event calendar"],
    },
  },
  {
    name: "Decision support",
    tone: "moss",
    layout: "recordRight",
    context: {
      body: "Review the evidence and reasoning behind an assessment before the desk decides. Capital authority stays with the desk.",
      task: "Locate prepared briefs, compare their assumptions and examine the material for the next desk review.",
      inputs: ["Assessment records", "Review trail"],
    },
  },
];

/* ---------- shared pieces ---------- */

function ContextWindow({ title, c }: { title: string; c: Composition["context"] }) {
  return (
    <aside className={styles.context} aria-label={`${title}: context`}>
      <h3 className={styles.contextTitle}>{title}</h3>
      <p className={styles.contextBody}>{c.body}</p>
      <div className={styles.task}>
        <span className={styles.label}>Task</span>
        <p>{c.task}</p>
      </div>
      <ul className={styles.inputs} aria-label="Inputs">
        {c.inputs.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  );
}

function AppWindow({ view, location, children, crop }: { view: string; location: string; children: ReactNode; crop?: boolean }) {
  return (
    <section className={styles.app} data-crop={crop || undefined} aria-label={`ATRX ${view} preview`}>
      <header className={styles.appBar}>
        <img src="/brand/atrx.svg" width={44} height={9} alt="ATRX" />
        <span className={styles.crumb}>
          {view} <span aria-hidden="true">/</span> <strong>{location}</strong>
        </span>
        <span className={styles.sample}>Illustrative data</span>
      </header>
      <div className={styles.appBody} tabIndex={0} role="region" aria-label={`${view} workspace`}>{children}</div>
    </section>
  );
}

function DocIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2H4v12h8V4.5L9.5 2Zm0 0v3H12M6 8h4M6 10.5h4" /></svg>;
}

/* Monitoring: a topic inbox alongside one selected development. */
function MarketMonitoringPreview() {
  const [selected, setSelected] = useState(0);
  const topic = monitoredTopics[selected];
  return (
    <AppWindow view="Monitor" location="Monitored developments">
      <div className={styles.monitoring}>
        <div className={styles.topicRail}>
          <h4>Following</h4>
          <ul aria-label="Monitored topics">
            {monitoredTopics.map((item, i) => <li key={item.name}><button type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.name}</button></li>)}
          </ul>
        </div>
        <article className={styles.development}>
          <span className={styles.meta}>{topic.period}</span>
          <h4>{selected === 0 ? "Monetary policy outlook" : topic.name}</h4>
          <h5>{topic.title}</h5>
          <p>{topic.observation}</p>
          <section className={styles.relatedObservations} aria-label="Related observations">
            <h5>Related observations</h5>
            <dl>{topic.related.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
          </section>
          <div className={styles.openQuestion}><h5>Still to investigate</h5><p>{topic.open}</p></div>
          <p className={styles.inputLine}>Inputs: {topic.inputs}</p>
        </article>
      </div>
    </AppWindow>
  );
}

/* Research: a submitted request, open investigation plan and working excerpt. */
function MacroResearchPreview() {
  return (
    <AppWindow view="Research" location="Investigation plan" crop>
      <div className={styles.researchPlanner}>
        <div className={styles.submittedRequest}><span className={styles.meta}>Research request</span><p>{research.request}</p></div>
        <section className={styles.investigation}>
          <h4>Research plan</h4>
          <ol>{research.plan.map((step) => <li key={step}>{step}</li>)}</ol>
        </section>
        <section className={styles.workingOutput}>
          <span className={styles.meta}>Working output</span>
          <h5>Transmission to test</h5>
          <p>{research.output}</p>
          <p className={styles.evidenceGap}>{research.gap}</p>
        </section>
        <div className={styles.followupQuestion}><span className={styles.meta}>Follow-up question</span><p>{research.followup}</p></div>
      </div>
    </AppWindow>
  );
}

/* Risk: a formal assessment memorandum, without dashboard chrome. */
function RiskReviewPreview() {
  return (
    <AppWindow view="Risk" location="Assessment memorandum" crop>
      <article className={styles.assessment}>
        <header className={styles.assessmentHeader}>
          <h4>Risk assessment</h4>
          <p>Proposed FX exposure during a policy event</p>
          <dl><div><dt>Review basis</dt><dd>Event calendar · Desk mandate</dd></div><div><dt>Review state</dt><dd>Stopped by macro blackout</dd></div></dl>
        </header>
        <section><h5>Assessment context</h5><p>{riskReview.context}</p></section>
        <section>
          <h5>Conditions reviewed</h5>
          <table className={styles.assessmentTable}>
            <thead><tr><th scope="col">Condition & basis</th><th scope="col">Finding</th></tr></thead>
            <tbody>{riskReview.conditions.map((condition) => <tr key={condition.name}><th scope="row">{condition.name}<span>{condition.basis}</span></th><td>{condition.finding}</td></tr>)}</tbody>
          </table>
        </section>
        <section><h5>Review finding</h5><p>{riskReview.finding}</p></section>
        <section><h5>Conditions for reassessment</h5><p>{riskReview.next}</p></section>
      </article>
    </AppWindow>
  );
}

/* Decisions: a compact library of prepared work, with a selected document below. */
function DecisionSupportPreview() {
  const [selected, setSelected] = useState(0);
  const brief = savedBriefs[selected];
  return (
    <AppWindow view="Decisions" location="Prepared materials">
      <div className={styles.decisionWorkspace}>
        <header><h4>Decision workspace</h4><p className={styles.meta}>Prepared materials for desk review</p></header>
        <ul className={styles.documentLibrary} aria-label="Prepared review materials">
          {savedBriefs.map((item, i) => <li key={item.name}><button type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}><DocIcon /><span><strong>{item.name}</strong><span>{item.caption}</span></span></button></li>)}
        </ul>
        <article className={styles.selectedBrief}>
          <span className={styles.meta}>{brief.name}</span>
          <h5>{brief.title}</h5>
          <p>{brief.summary}</p>
          <h6>Review focus</h6>
          <ul>{brief.points.map((point) => <li key={point}>{point}</li>)}</ul>
          <div className={styles.briefNext}><h6>Next review</h6><p>{brief.next}</p></div>
        </article>
      </div>
    </AppWindow>
  );
}

const apps = [<MarketMonitoringPreview key="m" />, <MacroResearchPreview key="r" />, <RiskReviewPreview key="k" />, <DecisionSupportPreview key="d" />];

export default function Practice() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const ids = compositions.map((_, i) => `${uid}-tab-${i}`);
  return (
    <div className={styles.showcase}>
      <div className={styles.tabs} role="tablist" aria-label="ATRX functions" onKeyDown={(e) => onTabListKeyDown(e, ids, active, setActive)}>
        {compositions.map((c, i) => (
          <button key={c.name} type="button" role="tab" id={ids[i]} aria-selected={active === i} aria-controls={`${uid}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}>
            {c.name}
          </button>
        ))}
      </div>
      <div className={styles.stage} data-tone={compositions[active].tone}>
        {compositions.map((c, i) => (
          <div
            key={c.name}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={ids[i]}
            className={styles.composition}
            data-layout={c.layout}
            data-active={active === i || undefined}
            inert={active !== i}
          >
            <ContextWindow title={c.name} c={c.context} />
            {apps[i]}
          </div>
        ))}
      </div>
      <p className={styles.disclaimer}>Illustrative interface with sample data. No live connection, quotes or executed trades.</p>
    </div>
  );
}
