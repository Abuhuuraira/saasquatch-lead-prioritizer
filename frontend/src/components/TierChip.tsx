import type { Tier } from "../types";
import { Flame, HalfSun, Snowflake } from "./Icons";

const ICON = { Hot: Flame, Warm: HalfSun, Cold: Snowflake };

// Icon + label always ride together, so the tier never depends on hue alone.
export function TierChip({ tier }: { tier: Tier }) {
  const Icon = ICON[tier];
  return (
    <span className={`tier ${tier.toLowerCase()}`}>
      <Icon size={12} />
      {tier}
    </span>
  );
}
