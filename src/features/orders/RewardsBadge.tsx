"use client";

import { rewardsBadgeText } from "@/lib/rewards-badge";

/** Amber "name · redeem/collect status" badge on order cards (same as POS). */
export function RewardsBadge({ loyalty }: { loyalty?: OrderLoyalty | null }) {
  if (!loyalty?.memberId) return null;
  const text = rewardsBadgeText(loyalty);
  if (!text) return null;
  return (
    <span className="mt-1 inline-block rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white">
      {text}
    </span>
  );
}
