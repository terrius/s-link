// app/page.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import {DashboardClient} from "./DashboardClient";
export const dynamic = "force-dynamic";

export default async function MainPage() {
  // 1. 임시로 'test@example.com' 유저의 정보를 가져옵니다. (로그인 구현 전)
  const user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
    include: {
      qrCodes: true, // 유저가 가진 QR 코드들도 같이 가져옴
    },
  });

  // 유저가 없으면 (api/setup 안 했을 경우) 빈 껍데기만 보여줌
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">데이터가 없습니다.</h1>
        <p className="mb-4">먼저 /api/setup 페이지를 실행해주세요.</p>
        <a href="/api/setup" className="text-blue-500 underline">데이터 세팅하러 가기</a>
      </div>
    );
  }

  // 2. 클라이언트 컴포넌트에 데이터 전달
  return (
    <DashboardClient 
      user={{
        name: user.name,
        email: user.email,
      }}
      qrCodes={user.qrCodes.map(qr => ({
        id: qr.id,
        name: qr.name,
        statusMessage: qr.statusMessage,
        isActive: qr.isActive,
        scans: 0, // 나중에 CallLog와 연동 필요
      }))}
    />
  );
}