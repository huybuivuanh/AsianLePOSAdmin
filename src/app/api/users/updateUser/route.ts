import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { uid, name, email, password, role } = await req.json();

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    await adminAuth.updateUser(uid, {
      email,
      password,
      displayName: name,
    });

    // 2️⃣ Update Firestore
    await adminDb.collection("users").doc(uid).update({
      name,
      email,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
