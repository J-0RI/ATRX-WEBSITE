"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeftRight, ChartNoAxesColumn, FileSearch, GitBranch, Landmark, Radar, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { onTabListKeyDown } from "./tabs";
import { monitoredTopics, research, riskReview, savedBriefs } from "./PracticeData";
import { AppToolbar, IconTip, Notice, UserMessage, WorkflowConclusion } from "./AtrxUi";
import styles from "./Practice.module.css";

/*
 * ATRX in practice — layered product showcase.
 * One artwork-backed stage; per function a compact context window (why the work matters)
 * and a larger, cropped ATRX software window. Each view has its own task-specific anatomy.
 * Fixtures in PracticeData.ts are illustrative; no live data, external citations or execution.
 */

type Composition = {
  name: string;
  /** Function-switcher icon (decision-20261018-function-switcher-icons); Lucide only. */
  icon: LucideIcon;
  tone: "sage" | "slate" | "stone" | "moss";
  layout: "chartLeft" | "docRight" | "reviewLeft" | "recordRight";
  context: { body: string; task: string; inputs: string[] };
};

const compositions: Composition[] = [
  {
    name: "Market monitoring",
    icon: Radar,
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
    icon: FileSearch,
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
    icon: Shield,
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
    icon: GitBranch,
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
      <AppToolbar section={view} page={location} />
      <div className={styles.appBody} tabIndex={0} role="region" aria-label={`${view} workspace`}>{children}</div>
    </section>
  );
}

function DocIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2H4v12h8V4.5L9.5 2Zm0 0v3H12M6 8h4M6 10.5h4" /></svg>;
}

/* Monitoring rail icons, one per stream: central bank policy, currency exchange, economic data. */
const railIcons = { "surv-01": Landmark, "surv-02": ArrowLeftRight, "surv-03": ChartNoAxesColumn };

/* Monitoring: an icon navigation rail alongside the selected stream's detailed brief. */
function MarketMonitoringPreview() {
  const [selected, setSelected] = useState(0);
  const topic = monitoredTopics[selected];
  return (
    <AppWindow view="Monitor" location="Surveillance brief">
      <div className={styles.monitoringWorkspace}>
        {/* Left: icon navigation rail (decision-20261018-monitoring-icon-rail) */}
        <TooltipProvider delayDuration={200}>
          <div className={styles.surveillanceRail}>
            <ul className={styles.railList} role="tablist" aria-orientation="vertical" aria-label="Monitored market streams">
              {monitoredTopics.map((item, i) => {
                const Icon = railIcons[item.id as keyof typeof railIcons];
                return (
                  <li key={item.id} role="presentation">
                    <IconTip label={item.name}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected === i}
                        aria-label={item.name}
                        className={styles.railItemButton}
                        onClick={() => setSelected(i)}
                      >
                        <Icon aria-hidden="true" />
                      </button>
                    </IconTip>
                  </li>
                );
              })}
            </ul>
          </div>
        </TooltipProvider>

        {/* Right: Selected intelligence brief */}
        <article className={styles.monitoringBrief} aria-label={`${topic.name}: Intelligence Brief`}>
          {/* Header strip */}
          <div className={styles.briefHeader}>
            <div className={styles.briefTags}>
              <span className={styles.briefCategory}>{topic.category}</span>
              <span className={styles.briefDivider} aria-hidden="true">/</span>
              <span className={styles.briefTopic}>{topic.name}</span>
              <span className={styles.briefDivider} aria-hidden="true">/</span>
              <span className={styles.briefPeriod}>{topic.period}</span>
            </div>
            <span className={styles.briefStatusBadge}>Surveillance update</span>
          </div>

          {/* Headline & change */}
          <h4 className={styles.briefHeadline}>{topic.headline}</h4>
          <p className={styles.briefChange}>{topic.change}</p>

          {/* Verified Observations Matrix */}
          <div className={styles.observationsBlock}>
            <h5 className={styles.blockHeading}>Empirical observations</h5>
            <div className={styles.observationsGrid}>
              {topic.observations.map((obs) => (
                <div key={obs.aspect} className={styles.observationCard}>
                  <strong className={styles.obsAspect}>{obs.aspect}</strong>
                  <p className={styles.obsDetail}>{obs.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analytical Context */}
          <Notice tone="info" title="Analytical transmission context">
            {topic.analyticalContext}
          </Notice>

          {/* Unresolved Interpretation */}
          <div className={styles.unresolvedQuestionRow}>
            <span className={styles.unresolvedLabel}>Unresolved interpretation</span>
            <p className={styles.unresolvedText}>{topic.unresolved}</p>
          </div>

          {/* Workflow conclusion: Surveillance continuation */}
          <WorkflowConclusion
            label="Surveillance continuation"
            primaryText={topic.continuation}
            supportingText={topic.continuationContext}
          />
        </article>
      </div>
    </AppWindow>
  );
}

/* Research: a submitted request, structured process plan, working excerpt and evidence gap. */
function MacroResearchPreview() {
  return (
    <AppWindow view="Research" location="Investigation plan" crop>
      <div className={styles.researchPlanner}>
        {/* A. User request: distinct compact user-input surface */}
        <UserMessage>{research.request}</UserMessage>

        {/* B. ATRX response: short transitional sentence */}
        <div className={styles.systemResponseRow}>
          <div className={styles.systemAvatar} aria-hidden="true">
            <img className={styles.systemIdentityIcon} src="/brand/atrx-response-icon.svg" width={18} height={18} alt="" />
          </div>
          <p className={styles.systemResponseText}>{research.response}</p>
        </div>

        {/* C. Structured research-plan module: integrated vertical progression */}
        <div className={styles.planModule}>
          <div className={styles.planModuleHeader}>
            <div className={styles.planTitleWrap}>
              <svg className={styles.planHeaderIcon} viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.5 4h11M2.5 8h11M2.5 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <h4 className={styles.planModuleTitle}>{research.planTitle}</h4>
            </div>
            <span className={styles.planModuleScope}>4-phase investigation</span>
          </div>

          <div className={styles.planTimeline}>
            {research.plan.map((step, idx) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";
              return (
                <div
                  key={step.phase}
                  className={styles.planStep}
                  data-status={step.status}
                >
                  <div className={styles.stepTrack}>
                    <div className={styles.stepNode}>
                      {isCompleted ? (
                        <svg viewBox="0 0 12 12" className={styles.checkIcon} aria-hidden="true">
                          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      ) : isActive ? (
                        <span className={styles.activeDot} />
                      ) : (
                        <span className={styles.pendingDot} />
                      )}
                    </div>
                    {idx < research.plan.length - 1 && <div className={styles.stepConnector} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepPhaseTitle}>{step.phase}</span>
                      {isActive && <span className={styles.activePhaseTag}>In progress</span>}
                      {isCompleted && <span className={styles.completedPhaseTag}>Reviewed</span>}
                    </div>
                    <p className={styles.stepDetail}>{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* D. Research-output excerpt: substantive analytical findings and missing evidence */}
        <div className={styles.analyticalExcerpt}>
          <div className={styles.excerptHeader}>
            <span className={styles.excerptMeta}>Working finding</span>
            <span className={styles.excerptTag}>Transmission mechanism</span>
          </div>
          <p className={styles.findingParagraph}>{research.finding}</p>

          <Notice tone="info" title="Evidence still required" className={styles.excerptNotice}>
            {research.gap}
          </Notice>
        </div>

        {/* E. Workflow conclusion: Next action */}
        <WorkflowConclusion
          label="Next action"
          primaryText={research.action}
          supportingText={research.actionContext}
        />
      </div>
    </AppWindow>
  );
}

/* Risk: an institutional assessment memorandum with criteria matrix and precedence veto. */
function RiskReviewPreview() {
  return (
    <AppWindow view="Risk" location="Assessment memorandum" crop>
      <article className={styles.assessment}>
        {/* Memo header */}
        <header className={styles.assessmentHeader}>
          <div className={styles.assessmentTitleRow}>
            <div>
              <span className={styles.memoRef}>{riskReview.ref} · {riskReview.desk}</span>
              <h4 className={styles.assessmentTitle}>{riskReview.title}</h4>
            </div>
            <span className={styles.vetoBadge}>Veto enforced</span>
          </div>

          <dl className={styles.memoMetaGrid}>
            <div>
              <dt>Review basis</dt>
              <dd>{riskReview.basis}</dd>
            </div>
            <div>
              <dt>Precedence rule</dt>
              <dd>Macro blackout takes absolute precedence</dd>
            </div>
          </dl>
        </header>

        {/* Section 1: Assessment Context */}
        <section className={styles.assessmentSection}>
          <h5 className={styles.sectionHeader}>Assessment context</h5>
          <p className={styles.contextStatement}>{riskReview.context}</p>
        </section>

        {/* Section 2: Evaluation Criteria Table */}
        <section className={styles.assessmentSection}>
          <div className={styles.sectionHeaderRow}>
            <h5 className={styles.sectionHeader}>Mandate evaluation criteria</h5>
            <span className={styles.evalCount}>4 criteria screened</span>
          </div>

          <table className={styles.assessmentTable}>
            <thead>
              <tr>
                <th scope="col" className={styles.colCriterion}>Criterion & policy basis</th>
                <th scope="col" className={styles.colFinding}>Observed condition</th>
                <th scope="col" className={styles.colOutcome}>Review state</th>
              </tr>
            </thead>
            <tbody>
              {riskReview.conditions.map((item) => {
                const isVeto = item.status === "veto";
                return (
                  <tr key={item.name} className={isVeto ? styles.vetoRow : undefined}>
                    <td className={styles.colCriterion}>
                      <strong>{item.name}</strong>
                      <span>{item.basis}</span>
                    </td>
                    <td className={styles.colFinding}>{item.finding}</td>
                    <td className={styles.colOutcome}>
                      <span className={isVeto ? styles.vetoTag : styles.unevaluatedTag}>
                        {item.outcome}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Section 3: Reasoned Finding */}
        <section className={styles.assessmentSection}>
          <h5 className={styles.sectionHeader}>Review finding & limit rationale</h5>
          <Notice tone="warning" title="Review stopped at macro blackout">
            {riskReview.finding}
          </Notice>
        </section>

        {/* Section 4: Conditions for Reassessment */}
        <section className={styles.assessmentSection}>
          <h5 className={styles.sectionHeader}>Conditions for reassessment</h5>
          <ul className={styles.reassessmentList}>
            {riskReview.reassessment.map((rule) => (
              <li key={rule}>
                <span className={styles.bulletNode} aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 5: Workflow conclusion: Further review */}
        <WorkflowConclusion
          label="Further review"
          primaryText={riskReview.nextStep}
          supportingText={riskReview.authority}
        />
      </article>
    </AppWindow>
  );
}

/* Decisions: an executive decision-brief workspace with supporting reasoning and uncertainty limits. */
function DecisionSupportPreview() {
  const [selected, setSelected] = useState(0);
  const brief = savedBriefs[selected];
  return (
    <AppWindow view="Decisions" location="Executive decision brief">
      <div className={styles.decisionWorkspace}>
        {/* Document Switcher Rail at Top */}
        <div className={styles.briefSelectorBar}>
          <span className={styles.selectorLabel}>Prepared briefs:</span>
          <div className={styles.briefTabs} role="tablist" aria-label="Prepared decision briefs">
            {savedBriefs.map((item, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={styles.briefTabButton}
                  onClick={() => setSelected(idx)}
                >
                  <DocIcon />
                  <span className={styles.briefTabName}>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Working Document */}
        <article className={styles.briefDocument} aria-label={`${brief.title}: Decision Brief`}>
          {/* Header */}
          <header className={styles.briefDocHeader}>
            <div className={styles.briefMetaRow}>
              <span className={styles.briefRefBadge}>{brief.id} · {brief.meta}</span>
              <span className={styles.briefDeskBadge}>Prepared for desk review</span>
            </div>
            <h4 className={styles.briefDocTitle}>{brief.title}</h4>
            <span className={styles.briefCaption}>{brief.caption}</span>
          </header>

          {/* Region B: Executive Conclusion */}
          <div className={styles.executiveSummaryBlock}>
            <span className={styles.executiveLabel}>Executive takeaway</span>
            <p className={styles.executiveText}>{brief.executiveSummary}</p>
          </div>

          {/* Region C: Supporting Reasoning Pillars */}
          <div className={styles.reasoningSection}>
            <h5 className={styles.reasoningHeading}>Supporting analytical reasoning</h5>
            <div className={styles.reasoningPillars}>
              {brief.pillars.map((pillar) => (
                <div key={pillar.label} className={styles.pillarCard}>
                  <strong className={styles.pillarLabel}>{pillar.label}</strong>
                  <p className={styles.pillarText}>{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Region D: Limitations & Uncertainties */}
          <Notice tone="info" title="Key uncertainties & review considerations">
            {brief.uncertainty}
          </Notice>

          {/* Region E: Workflow conclusion: Next consideration */}
          <WorkflowConclusion
            label="Next consideration"
            primaryText={brief.nextAction}
            supportingText="Capital authority remains with desk"
          />
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
            <span className={styles.tabLabel}>
              <c.icon aria-hidden="true" strokeWidth={1.75} />
              {c.name}
            </span>
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
