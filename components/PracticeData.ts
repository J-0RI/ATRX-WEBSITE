/** Authored software excerpts, not live news or production records.
 * Concepts: /capabilities/market-intelligence, /control/native-risk-mandates,
 * /delivery/audit-grade-ledgers. No external provenance or default desk limits implied.
 */

/* =========================================================================
   1. Market Monitoring: Intelligence Surveillance Feed & Detailed Briefing
   ========================================================================= */
export const monitoredTopics = [
  {
    id: "surv-01",
    name: "Policy expectations",
    category: "Rate guidance",
    period: "Policy review window",
    headline: "Downward revision in expected US policy path requires cross-market relative context",
    change: "Market-implied terminal rate shifted downward by 34 bps across the 12-month forward curve, initiating cross-asset repricing.",
    observations: [
      {
        aspect: "Yield differential",
        detail: "US-German 2Y spread compressed 14 bps, narrowing the dollar's nominal rate advantage against the euro.",
      },
      {
        aspect: "Funding conditions",
        detail: "Short-term cross-currency basis swaps remained stable, indicating orderly liquidity despite the rate shift.",
      },
      {
        aspect: "Positioning skew",
        detail: "Commercial positioning data shows moderate net dollar long exposure, leaving open the risk of unwinding flows.",
      },
    ],
    analyticalContext: "A downward revision in expected US policy rates tends to weaken the dollar via relative yield compression. However, if partner central banks adjust guidance simultaneously, the effective bilateral rate differential remains bounded.",
    unresolved: "Does the yield compression reflect genuine policy divergence, or are global central banks preparing symmetrical easing cycles?",
    continuation: "Track upcoming European Central Bank and Bank of Japan commentary to evaluate relative policy transmission.",
    continuationContext: "Scheduled central bank communications calendar",
  },
  {
    id: "surv-02",
    name: "Currency conditions",
    category: "FX transmission",
    period: "Cross-market window",
    headline: "Dollar Index retreat exceeds short-end rate adjustment across major currency pairs",
    change: "The DXY index declined 1.4% over five trading sessions, outpacing the move implied solely by 2-year sovereign yield spreads.",
    observations: [
      {
        aspect: "Transmission asymmetry",
        detail: "EUR/USD appreciated faster than nominal rate differentials alone predict; JPY failed to participate in dollar weakness.",
      },
      {
        aspect: "Reserve flows",
        detail: "No evidence of sovereign reserve rebalancing or official liquidity intervention across monitored currencies.",
      },
      {
        aspect: "Risk-asset correlation",
        detail: "Equity volatility spiked mid-week without driving customary defensive dollar inflows, indicating weaker safe-haven demand.",
      },
    ],
    analyticalContext: "When currency movements diverge from interest-rate differentials, secondary transmission channels—such as risk-sentiment regimes or funding-market imbalances—frequently dominate immediate pricing.",
    unresolved: "Whether the haven channel remains impaired, or if current market pricing simply reflects temporary asset rotation.",
    continuation: "Monitor cross-currency swap spreads and risk premia in European corporate credit to verify funding stability.",
    continuationContext: "Continuous intraday cross-currency liquidity feed",
  },
  {
    id: "surv-03",
    name: "Inflation developments",
    category: "Macro evidence",
    period: "Macro data release",
    headline: "Core services disinflation reinforces market expectations of an easing trajectory",
    change: "Latest core services CPI registered 0.22% month-over-month, confirming a deceleration in the primary persistence component.",
    observations: [
      {
        aspect: "Underlying momentum",
        detail: "3-month annualized core inflation slowed to 2.4%, approaching central bank operating tolerance bands.",
      },
      {
        aspect: "Breakeven rates",
        detail: "5-year inflation breakevens held steady at 2.18%, signaling well-anchored medium-term inflation expectations.",
      },
      {
        aspect: "Wage indicators",
        detail: "Private-sector wage growth metrics moderated to 3.6% annualized, reducing prospective cost-push pressures.",
      },
    ],
    analyticalContext: "Disinflation in labor-intensive services provides necessary empirical validation for rate cuts, distinguishing fundamental easing from preemptive or reactive liquidity provisions.",
    unresolved: "Which threshold of labor-market softening is required before the central bank accelerates its path?",
    continuation: "Compare monthly employment reports and unit labor cost revisions against the stated reaction function.",
    continuationContext: "Scheduled monthly labor and inflation releases",
  },
];

/* =========================================================================
   2. Macro Research: Structured Investigation Workspace
   ========================================================================= */
export const research = {
  request: "Examine how a lower expected US policy path could influence currency conditions. Separate the economic transmission mechanism from competing explanations and identify the evidence needed to distinguish them.",
  response: "I've organized the investigation around the principal transmission channels and the evidence needed to test them.",
  planTitle: "US Policy and Currency Conditions",
  plan: [
    {
      phase: "Review economic evidence",
      detail: "Examine policy expectations, interest-rate differentials, and relevant currency-market observations.",
      status: "completed",
    },
    {
      phase: "Evaluate competing explanations",
      detail: "Consider relative yields, funding conditions, positioning, and factors affecting demand for the dollar.",
      status: "active",
    },
    {
      phase: "Synthesize findings",
      detail: "Separate supported observations from hypotheses requiring more evidence.",
      status: "pending",
    },
    {
      phase: "Prepare research output",
      detail: "Organize the investigation into a reviewable briefing with explicit assumptions and unresolved questions.",
      status: "pending",
    },
  ],
  finding: "A lower expected US policy path could weaken the dollar by narrowing relative interest-rate differentials. However, funding conditions, positioning, and changes in other central banks' policy expectations may alter that relationship.",
  gap: "Compare relevant yield differentials with currency movements and check whether funding conditions support the proposed explanation.",
  action: "Review the research briefing and evaluate whether funding conditions support the proposed transmission channel.",
  actionContext: "Awaiting yield-differential test before formal desk review",
};

/* =========================================================================
   3. Risk Review: Institutional Assessment Workspace
   ========================================================================= */
export const riskReview = {
  title: "Macro Policy-Window Exposure Assessment",
  ref: "RR-2026-042",
  status: "Veto enforced",
  basis: "Event Calendar · Desk Mandate Rev 4.2",
  desk: "G10 FX & Systematic Macro Desk",
  context: "Review of proposed currency position submitted ahead of scheduled Tier-1 central bank policy announcement. Risk protocol mandates calendar-based blackout verification prior to capital deployment or sizing authorization.",
  conditions: [
    {
      name: "Macro policy blackout",
      basis: "Mandatory freeze ±2 hours around scheduled FOMC rate decision",
      finding: "Overlaps policy announcement window",
      outcome: "Veto enforced",
      status: "veto",
    },
    {
      name: "Cumulative drawdown",
      basis: "1.25% maximum allowable daily portfolio impairment",
      finding: "Evaluation halted before limit calculation",
      outcome: "Not evaluated",
      status: "unevaluated",
    },
    {
      name: "Instrument authorization",
      basis: "Authorized spot & forward currency pairs only",
      finding: "Evaluation halted before compliance check",
      outcome: "Not evaluated",
      status: "unevaluated",
    },
    {
      name: "Liquidity stress floor",
      basis: "Minimum 90th-percentile interbank depth in target pairs",
      finding: "Evaluation halted before depth analysis",
      outcome: "Not evaluated",
      status: "unevaluated",
    },
  ],
  finding: "The scheduled macro blackout mandate triggered an immediate review veto. In accordance with risk governance rules, sizing calculations and limit validations were suspended. No capital deployment is permitted.",
  reassessment: [
    "Verify the event window has closed and policy statement has been published.",
    "Refresh realized volatility metrics and cross-currency liquidity depth.",
    "Submit fresh assessment under post-announcement market state.",
  ],
  nextStep: "Submit a fresh mandate assessment once the blackout window has elapsed and post-announcement volatility stabilizes.",
  authority: "Mandatory trading freeze remains in effect under RR-2026-042",
};

/* =========================================================================
   4. Decision Support: Executive Decision-Brief Workspace
   ========================================================================= */
export const savedBriefs = [
  {
    id: "brief-01",
    name: "Policy divergence & FX sizing",
    caption: "Relative yield vs funding dynamics",
    title: "US Policy Divergence & Currency Sizing Brief",
    meta: "Macro Strategy · Desk Review · Rev 1.2",
    executiveSummary: "A lower expected US policy path creates prospective downward pressure on the dollar, but persistent funding frictions and European central bank divergence prevent a one-way trend. Sizing should remain defensive until cross-currency basis confirms genuine dollar weakness.",
    pillars: [
      {
        label: "Macro transmission",
        text: "Narrowing 2-year yield differentials reduce the dollar's carry advantage, but nominal yield spreads alone have historically overpredicted rapid FX adjustments.",
      },
      {
        label: "Key assumptions",
        text: "Dollar funding liquidity remains orderly across swap markets; foreign central banks do not aggressively ease in lockstep.",
      },
      {
        label: "Alternative interpretation",
        text: "Recent dollar softening reflects speculative positioning unwind rather than an enduring structural regime transition.",
      },
    ],
    uncertainty: "Short-end rate spreads have stabilized while long yields continue to reprice. Without cross-currency basis confirmation, funding market dislocation remains an unquantified risk.",
    nextAction: "Evaluate whether to hedge tail dollar-funding volatility before committing to directional currency sizing.",
  },
  {
    id: "brief-02",
    name: "Swap basis & liquidity friction",
    caption: "Cross-market funding conditions",
    title: "Cross-Currency Swap Basis & Liquidity Assessment",
    meta: "Liquidity & Funding · Desk Review · Rev 2.0",
    executiveSummary: "Widening cross-currency basis indicates offshore dollar demand is becoming structural, counteracting the rate-differential channel. The desk should refrain from short-dollar positioning without funding relief.",
    pillars: [
      {
        label: "Funding channel",
        text: "Offshore dollar demand remains elevated; non-US financial institutions are paying a persistent premium to secure term dollar liquidity.",
      },
      {
        label: "Key assumptions",
        text: "Collateral velocity in tri-party repo stays within historical standard deviations; no emergency swap-line drawdowns.",
      },
      {
        label: "Alternative interpretation",
        text: "Basis widening may represent temporary quarter-end balance sheet contraction rather than systemic funding distress.",
      },
    ],
    uncertainty: "Spread between commercial paper and OIS has widened 4 bps, leaving open whether funding tightness will spill directly into spot FX pricing.",
    nextAction: "Review interbank liquidity metrics prior to the morning investment committee.",
  },
  {
    id: "brief-03",
    name: "Asymmetric policy paths",
    caption: "Sovereign spread risk analysis",
    title: "Asymmetric Policy Paths & Sovereign Spread Risk",
    meta: "Sovereign Rates · Desk Review · Rev 1.1",
    executiveSummary: "Core inflation persistence in major trading partners limits their ability to match US rate cuts, creating genuine bilateral policy divergence. High conviction in relative spreads, lower in outright directional beta.",
    pillars: [
      {
        label: "Divergence channel",
        text: "Sticky services inflation abroad constrains rate cuts, accelerating the compression of bilateral policy differentials.",
      },
      {
        label: "Key assumptions",
        text: "US disinflation proceeds without an abrupt growth shock; energy supply remains insulated from geopolitical disruption.",
      },
      {
        label: "Alternative interpretation",
        text: "A growth slowdown abroad could force central banks to cut rates regardless of inflation, nullifying the divergence thesis.",
      },
    ],
    uncertainty: "Services inflation momentum remains above central bank targets in 3 of 5 monitored jurisdictions.",
    nextAction: "Stress-test sovereign duration exposures against a scenario where foreign central banks pause cuts.",
  },
];
