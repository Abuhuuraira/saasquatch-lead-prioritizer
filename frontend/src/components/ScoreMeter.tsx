import type { Tier } from "../types";

export function ScoreMeter({ score, tier }: { score: number; tier: Tier }) {
  return (
    <div className={`score ${tier.toLowerCase()}`} title={`${score} out of 100`}>
      <span className="num">{score}</span>
      <span className="meter" role="img" aria-label={`Score ${score} of 100`}>
        <i style={{ width: `${Math.max(2, Math.min(100, score))}%` }} />
      </span>
    </div>
  );
}
