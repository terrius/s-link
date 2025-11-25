// app/api/setup/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. 테스트 유저 생성 (이미 있으면 건너뜀)
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {}, // 이미 있으면 수정 안 함
      create: {
        email: "test@example.com",
        name: "김철수",
        password: "dummy-password", // 실제 로그인 기능 붙일 때 해시화 필요
      },
    });

    // 2. 테스트 QR 코드 생성 (이미 있으면 초기화)
    const qrCode = await prisma.qRCode.upsert({
      where: { id: "test-qr-1" },
      update: {
        name: "내 차 (테스트용)",
        statusMessage: "차를 좀 빼는게 어떠시겠어요? 짜증 지대로거든요?.",
        isActive: true,
      },
      create: {
        id: "test-qr-1",
        name: "내 차 (테스트용)",
        statusMessage: "내차 내가 댄다는데 무슨 상관있으신가요??.",
        isActive: true,
        ownerId: user.id, // 위에서 만든 유저와 연결
      },
    });

    return NextResponse.json({
      message: "✅ 데이터 세팅 완료!",
      user: { name: user.name, email: user.email },
      qrCode: { id: qrCode.id, name: qrCode.name, status: qrCode.statusMessage }
    });

  } catch (error) {
    console.error("데이터 생성 실패:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}