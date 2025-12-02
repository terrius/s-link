// app/api/call/check/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ incomingCall: null });
    }

    // 1. 내 유저 ID 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ incomingCall: null });

    // 2. 내 QR 코드에 걸려온 'WAITING' 상태의 전화 찾기
    // (최근 1분 이내의 요청만 유효한 것으로 간주)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const activeCall = await prisma.callLog.findFirst({
      where: {
        qrCode: { ownerId: user.id }, // 내 QR 코드
        status: "WAITING",            // 대기 중인 상태
        createdAt: { gt: oneMinuteAgo }, // 1분 이내
      },
      include: { qrCode: true },
      orderBy: { createdAt: "desc" }, // 최신순
    });

    if (!activeCall) {
      return NextResponse.json({ incomingCall: null });
    }

    // 3. 전화 정보 반환
    return NextResponse.json({
      incomingCall: {
        id: activeCall.id,
        roomName: activeCall.roomName,
        qrName: activeCall.qrCode.name,
      },
    });

  } catch (error) {
    console.error("Call check error:", error);
    return NextResponse.json({ incomingCall: null });
  }
}