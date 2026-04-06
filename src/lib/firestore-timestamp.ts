import { Timestamp } from "firebase/firestore";

/** Normalizes Firestore read values to client `Timestamp` (handles Timestamp, {toDate}, Date, plain seconds). */
export function asTimestamp(value: unknown): Timestamp {
  if (value instanceof Timestamp) {
    return value;
  }
  if (
    value != null &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return Timestamp.fromDate((value as { toDate: () => Date }).toDate());
  }
  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }
  if (
    value != null &&
    typeof value === "object" &&
    typeof (value as { seconds: unknown }).seconds === "number" &&
    typeof (value as { nanoseconds: unknown }).nanoseconds === "number"
  ) {
    const v = value as { seconds: number; nanoseconds: number };
    return new Timestamp(v.seconds, v.nanoseconds);
  }
  return Timestamp.now();
}
