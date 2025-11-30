// app/api/qr/register/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1. 로그인 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. 입력값 검증
    const body = await req.json();
    const { name, statusMessage } = body;

    if (!name) {
      return NextResponse.json({ error: "QR 이름을 입력해주세요." }, { status: 400 });
    }

    // [추가된 로직] 4. 중복 이름 체크 (Validation)
    const existingQR = await prisma.qRCode.findFirst({
      where: {
        ownerId: user.id,
        name: name, // 같은 유저가 같은 이름을 쓰는지 확인
      },
    });

    if (existingQR) {
      return NextResponse.json({ 
        error: "DUPLICATE_NAME", // 클라이언트가 식별할 수 있는 에러 코드
        message: "이미 같은 이름의 QR 코드가 존재합니다. 다른 이름을 사용해주세요." 
      }, { status: 409 }); // 409 Conflict
    }

    // 5. DB에 QR 코드 생성
    const newQR = await prisma.qRCode.create({
      data: {
        name: name,
        statusMessage: statusMessage || "",
        ownerId: user.id,
        isActive: true,
      },
    });

    // 6. 성공 응답
    return NextResponse.json({ 
      success: true, 
      message: "QR 코드가 생성되었습니다.",
      qrCode: newQR,
      // 생성된 실제 접속 URL
      url: `${process.env.NEXTAUTH_URL}/user/${user.id}/${newQR.id}`
    });

  } catch (error) {
    console.error("QR 생성 에러:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}