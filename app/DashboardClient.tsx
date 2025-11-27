"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

// Icons
import {
  QrCode, User, Menu, Car, LogOut, ExternalLink, Plus, Edit, ShoppingBag
} from "lucide-react"

// DB 데이터 타입 정의
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
    scans: number;
  }[];
}

export function DashboardClient({ user, qrCodes }: DashboardProps) {
  const router = useRouter();
  const [localQrCodes, setLocalQrCodes] = useState(qrCodes);

  // 1. QR 활성/비활성 토글 (API 연동)
  const toggleQRStatus = async (id: string, currentStatus: boolean) => {
    // 낙관적 업데이트 (UI 먼저 반영)
    setLocalQrCodes((prev) =>
      prev.map((qr) => (qr.id === id ? { ...qr, isActive: !currentStatus } : qr))
    );

    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (!res.ok) throw new Error("Failed");
      router.refresh(); // 서버 데이터 동기화
    } catch (e) {
      alert("상태 변경에 실패했습니다.");
      // 실패 시 롤백 로직(생략 가능)
    }
  };

  // 2. 상태 메시지 수정
  const editStatusMessage = async (id: string, currentMsg: string | null) => {
    const newMsg = window.prompt("새로운 상태 메시지를 입력하세요:", currentMsg || "");
    if (newMsg === null) return;

    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusMessage: newMsg }),
      });

      if (res.ok) {
        setLocalQrCodes((prev) =>
          prev.map((qr) => (qr.id === id ? { ...qr, statusMessage: newMsg } : qr))
        );
        router.refresh();
      }
    } catch (e) {
      alert("수정 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Header --- */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">S-Link Dashboard</h1>
                <p className="text-xs text-gray-500">{user.name || "사용자"}님 환영합니다</p>
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

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  내 QR 코드 관리
                </CardTitle>
                <CardDescription>보유하신 S-Link QR 코드를 관리합니다.</CardDescription>
              </div>
              {/* '추가' 버튼 대신 '구매하기' 등으로 유도하는 것이 비즈니스 모델에 적합 */}
              <Button size="sm" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2"/>
                스토어
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localQrCodes.map((qr) => (
                <div key={qr.id} className="border rounded-lg p-4 bg-white shadow-sm transition-all hover:shadow-md">
                  
                  {/* 카드 내용 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      {/* QR 이미지 대신 아이콘 표시 (보안상 이미지 노출 방지) */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${qr.isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Car className="h-8 w-8" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-800">{qr.name}</h3>
                          <button 
                            onClick={() => editStatusMessage(qr.id, qr.statusMessage)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="상태 메시지 수정"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-[300px]">
                          {qr.statusMessage || "설정된 메시지가 없습니다."}
                        </p>
                      </div>
                    </div>

                    {/* 활성/비활성 스위치 */}
                    <div className="flex flex-col items-center gap-1">
                        <Switch 
                        checked={qr.isActive} 
                        onCheckedChange={() => toggleQRStatus(qr.id, qr.isActive)} 
                        />
                        <span className="text-[10px] text-gray-400">{qr.isActive ? "ON" : "OFF"}</span>
                    </div>
                  </div>
                  
                  {/* 하단 액션 버튼 */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <Link href={`/qr/${qr.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        화면 미리보기
                      </Button>
                    </Link>
                  </div>

                </div>
              ))}

              {localQrCodes.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                  <QrCode className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">등록된 QR 코드가 없습니다.</p>
                  <p className="text-sm text-gray-400 mt-1">S-Link 스토어에서 나만의 큐템을 만나보세요!</p>
                  <Button className="mt-4" variant="default">스토어 바로가기</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}