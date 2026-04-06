// src/app/api/createUser/route.ts
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2️⃣ Assign role via custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 3️⃣ Create Firestore document
    await adminDb.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
