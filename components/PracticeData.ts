/** Authored software excerpts, not live news or production records.
 * Concepts: /capabilities/market-intelligence, /control/native-risk-mandates,
 * /delivery/audit-grade-ledgers. No external provenance or default desk limits implied.
 */
export const monitoredTopics = [
  {
    name: "Policy expectations",
    title: "Policy-path revision needs relative context",
    period: "Policy-review window",
    observation: "The desk note describes a lower expected US policy path. The comparison with euro-area expectations is still incomplete.",
    related: [
      { label: "Relative policy", text: "A US revision alone does not establish a change in the relative rate path." },
      { label: "Funding conditions", text: "Dollar liquidity could reinforce or offset the proposed policy channel." },
    ],
    open: "Does the relative policy shift persist once funding conditions are considered?",
    inputs: "Desk policy note · Market-state notes",
  },
  {
    name: "Currency conditions",
    title: "Separate the common driver from local conditions",
    period: "Cross-market review window",
    observation: "The working comparison asks whether related currencies share a policy explanation or respond to different local conditions.",
    related: [
      { label: "Policy divergence", text: "Compare the policy outlook on both sides of each currency relationship." },
      { label: "Local conditions", text: "Retain growth and funding differences in the interpretation." },
    ],
    open: "Would a common dollar explanation still hold after local conditions are included?",
    inputs: "Cross-market notes · Policy comparison",
  },
  {
    name: "Inflation developments",
    title: "An inflation signal needs a transmission path",
    period: "Economic-observation review",
    observation: "The research note separates a change in inflation expectations from the policy response that markets may anticipate.",
    related: [
      { label: "Expected response", text: "Identify which part of the policy path the observation could affect." },
      { label: "Alternative drivers", text: "Check whether growth or supply conditions offer another explanation." },
    ],
    open: "Which evidence connects the inflation observation to a durable policy revision?",
    inputs: "Economic-observation note · Research outline",
  },
];

export const research = {
  request: "Examine how a lower expected US policy path could influence currency conditions. Separate the transmission mechanism from what still needs evidence.",
  plan: [
    "Review policy expectations and the relevant economic observations.",
    "Examine related currency and funding conditions.",
    "Compare the policy channel with competing explanations.",
    "Identify missing evidence and unresolved assumptions.",
  ],
  output: "Lower expected US rates could reduce the dollar’s relative yield support if other policy paths are unchanged. Tighter dollar funding could offset that channel.",
  gap: "The supplied notes do not yet establish persistence or cross-market confirmation. Keep the causal conclusion open.",
  followup: "What evidence would distinguish a policy effect from a funding effect?",
};

export const riskReview = {
  context: "Evaluate a proposed FX exposure during the desk’s policy-event window. The event calendar and desk mandate form the basis of this review.",
  conditions: [
    { name: "Macro blackout", basis: "The event window overlaps the assessment.", finding: "Stops assessment" },
    { name: "Drawdown & exposure", basis: "Limit evaluation was not reached after the veto.", finding: "Not evaluated" },
    { name: "Instrument permission", basis: "The stopped assessment did not reach this check.", finding: "Not evaluated" },
  ],
  finding: "The blackout rule stops the proposal before limit evaluation or sizing. No conclusion is recorded for the remaining mandate checks.",
  next: "Confirm the event window has closed, refresh market-state context and submit a fresh assessment for the full mandate review.",
};

export const savedBriefs = [
  {
    name: "Market assessment brief", caption: "Policy-path investigation", title: "Policy-path transmission",
    summary: "A lower expected US policy path is a working explanation for currency conditions, subject to relative policy and funding context.",
    points: ["Compare the expected policy path across markets.", "Keep funding conditions separate from the policy hypothesis."],
    next: "Resolve the evidence gaps before carrying the interpretation into a desk decision.",
  },
  {
    name: "Scenario comparison", caption: "Policy and funding channels", title: "Compare the competing explanations",
    summary: "The review keeps a relative-policy explanation alongside a funding explanation rather than assigning a common cause from price direction.",
    points: ["Policy channel: relative yield support changes.", "Funding channel: dollar liquidity reinforces or offsets the response."],
    next: "Identify which observations would weaken each explanation.",
  },
  {
    name: "Assumption review", caption: "Calendar and state context", title: "Assumptions to revisit",
    summary: "The next review depends on current control inputs and refreshed market-state context.",
    points: ["The event calendar reflects the desk’s current policy window.", "The prior market-state assessment is refreshed before reuse."],
    next: "Verify both assumptions when preparing a fresh assessment.",
  },
  {
    name: "Decision record", caption: "FX policy-window finding", title: "Stopped at the macro blackout",
    summary: "The review record retains the blackout finding and its basis. Subsequent checks remain unevaluated.",
    points: ["Basis retained: event calendar and desk mandate.", "No sizing or capital deployment follows this stopped assessment."],
    next: "Review the event window before considering a fresh assessment. Capital authority remains with the desk.",
  },
];
