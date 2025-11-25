"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch" // Switch 컴포넌트 필요
import {
  Shield, QrCode, User, Menu, Home, Car, LogOut, ExternalLink, Plus
} from "lucide-react"

// DB에서 받아올 데이터 타입 정의
interface DashboardProps {
  user: {
    name: string | null;
    email: string;
  };
  qrCodes: {
    id: string;
    name: string;
    statusMessage: string | null;
    isActive: boolean;
    scans: number; // 현재 DB엔 없지만 UI용으로 유지
  }[];
}

export function DashboardClient({ user, qrCodes }: DashboardProps) {
  // 상태 관리 (이제 DB 데이터를 초기값으로 씀)
  const [localQrCodes, setLocalQrCodes] = useState(qrCodes);

  // QR 활성/비활성 토글 (나중에 API 연결)
  const toggleQRStatus = (id: string) => {
    setLocalQrCodes((prev) => prev.map((qr) => 
      qr.id === id ? { ...qr, isActive: !qr.isActive } : qr
    ));
    // TODO: 실제 API로 상태 변경 요청 보내기
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">S-Link Dashboard</h1>
                <p className="text-xs text-gray-500">{user.name}님 환영합니다</p>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>메뉴</SheetTitle>
                  <SheetDescription>{user.email}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* 메뉴 링크들... (생략하거나 유지) */}
                  <div className="flex items-center space-x-3 p-3 text-red-600 cursor-pointer">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">로그아웃</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* QR 코드 리스트 영역 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  내 QR 코드 관리
                </CardTitle>
                <CardDescription>등록된 QR 코드 목록입니다.</CardDescription>
              </div>
              <Button size="sm"><Plus className="h-4 w-4 mr-1"/>추가</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localQrCodes.map((qr) => (
                <div key={qr.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{qr.name}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {qr.statusMessage || "상태 메시지 없음"}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={qr.isActive} 
                      onCheckedChange={() => toggleQRStatus(qr.id)} 
                    />
                  </div>
                  
                  {/* 바로가기 링크 버튼 */}
                  <Link href={`/user/me/${qr.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      방문자 화면 미리보기
                    </Button>
                  </Link>
                </div>
              ))}

              {localQrCodes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  등록된 QR 코드가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}