// app/api/call/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { qrCodeId, roomName } = await req.json();

    if (!qrCodeId || !roomName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // CallLog에 'WAITING' 상태로 기록 (소유자가 대기 중인 상태)
    const callLog = await prisma.callLog.create({
      data: {
        qrCodeId: qrCodeId,
        status: "WAITING", // ✅ 여기가 핵심! 소유자 대시보드가 감지하는 상태값
        roomName: roomName,
      },
    });

    return NextResponse.json({ success: true, callId: callLog.id });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}