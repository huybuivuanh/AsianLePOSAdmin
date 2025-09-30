import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const ref = adminDb.collection("categories").doc();
    await ref.set({
      name,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: ref.id });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
