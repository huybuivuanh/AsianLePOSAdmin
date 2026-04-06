import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    if (!uid) throw new Error("UID is required");

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    await adminAuth.deleteUser(uid);

    await adminDb.collection("users").doc(uid).delete();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
