// app/api/user/profile/route.ts (파일명 변경 추천)
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ 올바른 경로 (새로 만든 파일)
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nickname } = body;

    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json({ error: "닉네임은 2글자 이상이어야 합니다." }, { status: 400 });
    }

    // DB 업데이트 (Role은 건드리지 않음)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { nickname: nickname },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch  {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}