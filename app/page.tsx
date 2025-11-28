// app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // 👈 경로 변경! (@/api/... -> @/lib/auth)
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

// ... (나머지 코드는 그대로)

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  // 1. 로그인 체크 (이메일이 없으면 로그인 페이지로)
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 2. 유저 정보 조회
  // 위에서 이메일 유무를 체크했으므로 여기선 안전하게 사용 가능
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }, 
    include: {
      qrCodes: true,
    },
  });

  // 3. 온보딩 체크
  if (!user || !user.nickname) {
    redirect("/onboarding");
  }

  // 4. 대시보드 렌더링
  return (
    <DashboardClient
      user={{
        name: user.nickname || user.name,
        email: user.email || "",
      }}
      qrCodes={user.qrCodes.map((qr) => ({
        id: qr.id,
        name: qr.name,
        statusMessage: qr.statusMessage,
        isActive: qr.isActive,
        scans: 0,
      }))}
    />
  );
}