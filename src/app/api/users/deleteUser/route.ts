import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    if (!uid) throw new Error("UID is required");

    // 1️⃣ Delete user from Firebase Auth
    await adminAuth.deleteUser(uid);

    // 2️⃣ Delete Firestore document
    await adminDb.collection("users").doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
