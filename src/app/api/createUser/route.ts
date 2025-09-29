// src/app/api/createUser/route.ts
import { NextResponse } from "next/server";
import { adminAuth, db } from "../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // 1️⃣ Create Auth account
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2️⃣ Assign role via custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    // 3️⃣ Create Firestore document
    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role,
      createdAt: new Date(),
    });

    return NextResponse.json({ uid: userRecord.uid });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
