import { getServerSession } from "next-auth";
import { redirect } from "next/navigation"; // 👈 이 줄이 꼭 있어야 합니다!
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

// 동적 렌더링 강제 (DB 실시간 반영을 위해)
export const dynamic = "force-dynamic";

export default async function MainPage() {
  // 1. 세션 확인 (로그인 여부)
  const session = await getServerSession(authOptions);

  // 로그인이 안 되어 있으면 로그인 페이지로 튕겨냄
  if (!session) {
    redirect("/login");
  }

  // 2. 유저 정보 및 QR 목록 조회
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      qrCodes: true,
    },
  });

  // 3. 온보딩 체크 (유저 정보가 없거나 닉네임 설정을 안 했으면 온보딩으로 이동)
  if (!user || !user.nickname) {
    redirect("/onboarding");
  }

  // 4. 클라이언트 컴포넌트에 데이터 전달 및 렌더링
  return (
    <DashboardClient
      user={{
        name: user.nickname || user.name, // 닉네임 우선 표시
        email: user.email || "",
      }}
      qrCodes={user.qrCodes.map((qr) => ({
        id: qr.id,
        name: qr.name,
        statusMessage: qr.statusMessage,
        isActive: qr.isActive,
        scans: 0, // 추후 CallLog 카운트로 대체 가능
      }))}
    />
  );
}