/**
 * Text for the rewards badge: the member's name, then the points redeemed and/or collected
 * on this order. Null when neither happened, or the points were reversed.
 * Mirrors rewardsBadgeText in the POS app.
 */
export function rewardsBadgeText(loyalty: OrderLoyalty): string | null {
  if (loyalty.reversedAt != null) return null;

  const parts: string[] = [];
  if (loyalty.pointsRedeemed != null) parts.push(`−${loyalty.pointsRedeemed} pts used`);
  if (loyalty.collectedAt != null) parts.push(`+${loyalty.pointsEarned ?? 0} pts`);

  if (parts.length === 0) return null;
  return [loyalty.memberName || "Member", ...parts].join(" · ");
}
