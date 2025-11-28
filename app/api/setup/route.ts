// app/api/setup/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client"; // Enum 가져오기

export async function GET() {
  try {
    // 1. 일반 사용자 (USER) 생성
    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        name: "김철수",
        nickname: "철수",
        role: Role.USER,
      },
    });

    // 2. 매니저 (MANAGER - 설치 기사 등) 생성
    const manager = await prisma.user.upsert({
      where: { email: "manager@example.com" },
      update: {},
      create: {
        email: "manager@example.com",
        name: "테리우스",
        nickname: "큐알코드 관리자",
        role: Role.MANAGER,
      },
    });

    // 3. 관리자 (ADMIN) 생성
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        name: "관리자",
        nickname: "Super Admin",
        role: Role.ADMIN,
      },
    });

    // 4. 테스트 QR 생성 (일반 사용자용)
    await prisma.qRCode.upsert({
      where: { id: "test-qr-1" },
      update: {},
      create: {
        id: "test-qr-1",
        name: "내 차 (테스트용)",
        statusMessage: "잠시 주차 중입니다.",
        isActive: true,
        ownerId: user.id,
      },
    });

    return NextResponse.json({
      message: "✅ 역할별 테스트 데이터 세팅 완료!",
      accounts: [
        { email: user.email, role: user.role },
        { email: manager.email, role: manager.role },
        { email: admin.email, role: admin.role },
      ]
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}