// app/api/call/response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { callId, action } = await req.json(); // action: 'accept' | 'reject'

    if (!callId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 상태 업데이트 (CONNECTED 또는 REJECTED)
    const status = action === "accept" ? "CONNECTED" : "REJECTED";

    await prisma.callLog.update({
      where: { id: callId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}