// app/user/[userId]/[qrId]/page.tsx
import { prisma } from "@/lib/prisma"; // 우리가 만든 prisma 클라이언트
import { notFound } from "next/navigation";
import UserConnectionClient from "./UserConnectionClient";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; qrId: string }>;
}) {
  const resolvedParams = await params;
  const { qrId } = resolvedParams;

  // 1. DB에서 QR 정보 + 소유자 정보 조회
  const qrData = await prisma.qRCode.findUnique({
    where: { id: qrId },
    include: {
      owner: true, // 소유자(User) 정보까지 같이 가져오기 (Join)
    },
  });

  // 2. 데이터가 없으면 404 페이지로 이동
  if (!qrData) {
    return notFound();
  }

  // 3. 클라이언트 컴포넌트에 데이터 전달
  // (Date 객체는 직렬화 문제로 문자열로 변환해서 넘기는 게 안전합니다)
  return (
    <UserConnectionClient 
      qrData={{
        ...qrData,
        createdAt: qrData.createdAt.toISOString(),
        updatedAt: qrData.updatedAt.toISOString(),
      }} 
      ownerData={{
        name: qrData.owner.name || "익명 사용자",
        email: qrData.owner.email,
      }}
    />
  );
}