// app/api/call/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { qrCodeId, roomName } = await req.json();

    if (!qrCodeId || !roomName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // CallLog에 'WAITING' 상태로 기록
    // (Prisma Schema에 CallStatus Enum에 WAITING 추가 필요할 수 있음 - 일단 PENDING이나 MISSED 사용)
    const callLog = await prisma.callLog.create({
      data: {
        qrCodeId: qrCodeId,
        status: "MISSED", // 일단 생성 시점엔 부재중(MISSED) 또는 연결전 상태로 둠
        // roomName: roomName, // 스키마에 roomName 필드가 없다면 추가 필요 (Step 2-2 참고)
      },
    });

    return NextResponse.json({ success: true, callId: callLog.id });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}