// Calls the Rewards (loyalty) project's Cloud Functions as the signed-in POS
// account. Mirrors the POS app's rewardsService.
import { FirebaseError } from "firebase/app";
import { httpsCallable } from "firebase/functions";
import { rewardsFunctions } from "@/lib/rewards-firebase";

export type ReverseOrderResult = {
  /** Net change to the member's balance (refunded redeem minus removed earn). */
  pointsChanged: number;
  newBalance: number;
};

async function call<In, Out>(name: string, data: In): Promise<Out> {
  if (!rewardsFunctions) {
    throw new Error("Rewards isn't set up (missing NEXT_PUBLIC_REWARDS_FIREBASE_* values).");
  }
  try {
    const result = await httpsCallable<In, Out>(rewardsFunctions, name)(data);
    return result.data;
  } catch (err) {
    throw new Error(rewardsErrorMessage(err));
  }
}

/** Staff-facing message for a failed rewards call. */
export function rewardsErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "functions/not-found":
        return err.message || "No rewards member found.";
      case "functions/unauthenticated":
        return "Sign in to Rewards from the Dashboard page first.";
      case "functions/permission-denied":
        return "This Rewards account doesn't have POS access.";
      case "functions/failed-precondition":
      case "functions/invalid-argument":
        return err.message || "This action isn't allowed for this order.";
      case "functions/unavailable":
      case "functions/deadline-exceeded":
        return "No connection to Rewards. Check the internet and try again.";
    }
  }
  return "Rewards request failed. Try again.";
}

/** On cancel: undoes the order's earned and redeemed points, once. */
export async function reverseOrder(
  memberId: string,
  orderId: string,
): Promise<ReverseOrderResult> {
  const r = await call<
    { uid: string; orderId: string },
    { pointsChanged: number; balance: number }
  >("reverseOrder", { uid: memberId, orderId });
  return { pointsChanged: r.pointsChanged, newBalance: r.balance };
}
