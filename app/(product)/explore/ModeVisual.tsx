import type { PlanId } from "@/content/tiers";
import styles from "./explore.module.css";

const descriptions: Record<PlanId, string> = {
  standard: "One isolated environment with its market inputs highlighted: the plan studies incoming state before any output.",
  "api-access": "One isolated environment with its internal rule set highlighted: inputs are processed into configured signals.",
  "execution-access": "One isolated environment with its controlled output highlighted: directives leave for a single execution venue.",
  "single-desk": "One execution node connected to the desk through a single allocation path.",
  "multi-desk": "Three execution nodes coordinated through one allocation path to the desk.",
  "custom-routing": "Three execution nodes with every connection to the desk path highlighted for custom routing.",
  "dedicated-deployment": "A dedicated system boundary containing inference, research and governance records.",
  "multi-entity-deployment": "Two governed boundaries joined by one coordinating oversight path.",
};

/**
 * Compact architecture studies from each mode's published deployment model, composed for
 * the card's portrait 2:3 media field (vertical flow: inputs above, output below). Plans
 * within a mode share one drawing and differ only in which part carries the accent.
 */
export default function ModeVisual({ plan }: { plan: PlanId }) {
  const accent = (on: boolean) => (on ? styles.visualOutput : styles.visualRule);
  const end = (on: boolean) => (on ? styles.visualEnd : styles.visualEndMuted);

  return (
    <svg viewBox="0 0 300 450" role="img" aria-label={descriptions[plan]} preserveAspectRatio="xMidYMid meet">
      {(plan === "standard" || plan === "api-access" || plan === "execution-access") && (
        <>
          <path d="M108 42v52l27 30M192 42v52l-27 30" className={accent(plan === "standard")} />
          <circle cx="108" cy="42" r="3" className={end(plan === "standard")} />
          <circle cx="192" cy="42" r="3" className={end(plan === "standard")} />
          <rect x="56" y="124" width="188" height="212" className={styles.visualModule} />
          <rect x="84" y="152" width="132" height="156" className={plan === "api-access" ? styles.visualOutput : styles.visualInner} />
          <path d="M108 186h84m-84 22h84m-84 22h54m-54 44h84" className={styles.visualDetail} />
          <path d="M150 336v68" className={accent(plan === "execution-access")} />
          <rect x="146" y="404" width="8" height="8" className={end(plan === "execution-access")} />
        </>
      )}
      {(plan === "single-desk" || plan === "multi-desk" || plan === "custom-routing") && (
        <>
          {(plan === "single-desk" ? [168] : [48, 168, 288]).map((y) => (
            <g key={y}>
              <rect x="44" y={y} width="160" height="96" className={styles.visualModule} />
              <path d={`M68 ${y + 30}h82m-82 18h82m-82 18h52`} className={styles.visualDetail} />
              <path d={`M204 ${y + 48}h46`} className={accent(plan === "custom-routing")} />
            </g>
          ))}
          <path d={plan === "single-desk" ? "M250 216v186" : "M250 96v306"} className={styles.visualOutput} />
          <rect x="246" y="402" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
      {plan === "dedicated-deployment" && (
        <>
          <rect x="28" y="32" width="244" height="356" className={styles.visualBoundary} />
          <path d="M28 57V32h25m194 0h25v25" className={styles.visualOutput} />
          {[72, 168, 264].map((y) => (
            <g key={y}>
              <rect x="70" y={y} width="160" height="72" className={styles.visualModule} />
              <path d={`M90 ${y + 28}h64m-64 16h38m58-16h28m-28 16h18`} className={styles.visualDetail} />
            </g>
          ))}
          <path d="M50 108h20m-20 96h20m-20 96h20M230 108h20m-20 96h20m-20 96h20M50 108v192m200-192v192" className={styles.visualRule} />
          <path d="M150 336v76h96" className={styles.visualOutput} />
          <rect x="242" y="408" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
      {plan === "multi-entity-deployment" && (
        <>
          {[28, 230].map((b) => (
            <g key={b}>
              <rect x="28" y={b} width="200" height="168" className={styles.visualBoundary} />
              <path d={`M28 ${b + 20}V${b}h20m160 0h20v20`} className={styles.visualOutput} />
              {[b + 32, b + 92].map((y) => (
                <g key={y}>
                  <rect x="50" y={y} width="156" height="46" className={styles.visualModule} />
                  <path d={`M68 ${y + 16}h64m-64 14h36`} className={styles.visualDetail} />
                </g>
              ))}
            </g>
          ))}
          <path d="M228 112h34M228 314h34M262 112v302" className={styles.visualOutput} />
          <rect x="258" y="414" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
    </svg>
  );
}
