import type { ModeId } from "@/content/tiers";
import styles from "./explore.module.css";

const descriptions: Record<ModeId, string> = {
  "prosumer-node": "One isolated execution environment receiving market vectors and sending one controlled output.",
  "capital-desk": "Multiple execution nodes coordinated through one allocation path to the desk.",
  institutional: "A dedicated system boundary containing inference, research and governance records.",
};

/** Compact architecture studies, drawn from each mode's published deployment model. */
export default function ModeVisual({ mode }: { mode: ModeId }) {
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label={descriptions[mode]} preserveAspectRatio="xMidYMid meet">
      {mode === "prosumer-node" && (
        <>
          <path d="M38 104h75l24 32m-99 60h75l24-32" className={styles.visualRule} />
          <circle cx="38" cy="104" r="3" className={styles.visualPoint} />
          <circle cx="38" cy="196" r="3" className={styles.visualPoint} />
          <rect x="137" y="57" width="146" height="186" className={styles.visualModule} />
          <rect x="162" y="82" width="96" height="136" className={styles.visualInner} />
          <path d="M184 113h52m-52 18h52m-52 18h36m-36 37h52" className={styles.visualDetail} />
          <path d="M283 150h93" className={styles.visualOutput} />
          <rect x="373" y="146" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
      {mode === "capital-desk" && (
        <>
          {[46, 154, 262].map((x) => (
            <g key={x}>
              <rect x={x} y="70" width="74" height="125" className={styles.visualModule} />
              <path d={`M${x + 18} 99h38m-38 20h38m-38 20h25`} className={styles.visualDetail} />
              <path d={`M${x + 37} 195v38`} className={styles.visualRule} />
            </g>
          ))}
          <path d="M83 233h286" className={styles.visualOutput} />
          <rect x="369" y="229" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
      {mode === "institutional" && (
        <>
          <rect x="43" y="40" width="334" height="220" className={styles.visualBoundary} />
          <path d="M43 65V40h25m284 0h25v25" className={styles.visualOutput} />
          {[78, 131, 184].map((y) => (
            <g key={y}>
              <rect x="91" y={y} width="238" height="39" className={styles.visualModule} />
              <path d={`M111 ${y + 13}h77m-77 13h44m103-13h51m-51 13h32`} className={styles.visualDetail} />
            </g>
          ))}
          <path d="M72 97h19m-19 53h19m-19 53h19M329 97h19m-19 53h19m-19 53h19M72 97v106m276-106v106" className={styles.visualRule} />
          <path d="M210 223v20h138" className={styles.visualOutput} />
          <rect x="344" y="239" width="8" height="8" className={styles.visualEnd} />
        </>
      )}
    </svg>
  );
}
