// app/qr/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserConnectionClient from "@/app/user/[userId]/[qrId]/UserConnectionClient"; // 기존 컴포넌트 재사용

// 페이지 설정 (동적 렌더링)
export const dynamic = "force-dynamic";

export default async function PublicQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. DB에서 QR 정보 조회 (유저 정보 포함)
  const qrData = await prisma.qRCode.findUnique({
    where: { id },
    include: { owner: true },
  });

  // 2. 유효하지 않은 QR이면 404
  if (!qrData) {
    return notFound();
  }

  // 3. 기존 연결 화면(Client Component)을 그대로 보여줌
  return (
    <UserConnectionClient
      qrData={{
        id: qrData.id,
        name: qrData.name,
        statusMessage: qrData.statusMessage,
        isActive: qrData.isActive,
        createdAt: qrData.createdAt.toISOString(),
        updatedAt: qrData.updatedAt.toISOString(),
      }}
      ownerData={{
        name: qrData.owner?.name || "익명 사용자",
        email: qrData.owner?.email || "",
      }}
    />
  );
}