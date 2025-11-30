// app/user/[userId]/[qrId]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserConnectionClient from "./UserConnectionClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; qrId: string }>;
}) {
  const { userId, qrId } = await params;

  // 1. QR 정보 조회 (URL의 userId와 실제 소유자가 맞는지 검증)
  const qrData = await prisma.qRCode.findUnique({
    where: { 
      id: qrId,
      ownerId: userId // 보안: URL상의 주인과 실제 주인이 일치해야 함
    },
    include: { owner: true },
  });

  // 2. 데이터가 없으면 404
  if (!qrData) {
    return notFound();
  }

  // 3. 연결 화면 표시
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
        name: qrData.owner?.nickname || qrData.owner?.name || "익명 사용자",
        email: qrData.owner?.email || "",
      }}
    />
  );
}