"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { QRCodeCanvas } from "qrcode.react" // QR 라이브러리 추가

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

// Icons
import {
  QrCode, User, Menu, Car, LogOut, ExternalLink, Plus, Edit, ShoppingBag, Phone
} from "lucide-react"

// DB 데이터 타입 정의
interface DashboardProps {
  user: {
    id: string;
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
  const [origin, setOrigin] = useState(""); // 도메인 주소 저장용
  
  // 전화 수신 상태 관리
  const [incomingCall, setIncomingCall] = useState<{ id: string, roomName: string, qrName: string } | null>(null);

  // 초기 로드 시 현재 도메인(origin) 가져오기
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // 1. [기능] 수신 대기 (Polling)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/call/check");
        const data = await res.json();
        
        if (data.incomingCall) {
          setIncomingCall(data.incomingCall);
        } else {
          setIncomingCall(null);
        }
      } catch {
        // polling error ignore
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 2. [기능] 전화 응답 처리
  const handleRespond = async (action: "accept" | "reject") => {
    if (!incomingCall) return;

    try {
      await fetch("/api/call/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId: incomingCall.id, action }),
      });

      if (action === "accept") {
        router.push(`/call/${incomingCall.roomName}`);
      }
      setIncomingCall(null);
    } catch {
      alert("오류가 발생했습니다.");
    }
  };

  // 3. [기능] QR 활성/비활성 토글
  const toggleQRStatus = async (id: string, currentStatus: boolean) => {
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
      router.refresh();
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
  };

  // 4. [기능] 상태 메시지 수정
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
    } catch {
      alert("수정 실패");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* 전화 수신 모달 */}
      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-6 bg-white shadow-2xl border-0 ring-4 ring-blue-500/30">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Phone className="h-10 w-10 animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">전화 요청!</h3>
                <p className="text-slate-500 mt-2">
                  <span className="font-semibold text-blue-600">[{incomingCall.qrName}]</span>에서<br/>
                  연결을 요청하고 있습니다.
                </p>
              </div>
              <div className="flex gap-4 w-full pt-4">
                <Button variant="outline" className="flex-1 h-14 text-lg border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => handleRespond("reject")}>거절</Button>
                <Button className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20" onClick={() => handleRespond("accept")}>받기</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

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
                  <button
                    className="w-full flex items-center space-x-3 p-3 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors text-left"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">로그아웃</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
              
              <div className="flex gap-2">
                <Link href="/qr/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-1"/>
                    등록
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <ShoppingBag className="h-4 w-4 mr-2"/>
                  스토어
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localQrCodes.map((qr) => (
                <div key={qr.id} className="border rounded-lg p-4 bg-white shadow-sm transition-all hover:shadow-md">
                  
                  <div className="flex items-center justify-between mb-3">
                    {/* 왼쪽 정보 영역 */}
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className={`w-14 h-14 min-w-14 rounded-xl flex items-center justify-center ${qr.isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Car className="h-8 w-8" />
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-800 truncate">{qr.name}</h3>
                          <button 
                            onClick={() => editStatusMessage(qr.id, qr.statusMessage)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="상태 메시지 수정"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[300px]">
                          {qr.statusMessage || "설정된 메시지가 없습니다."}
                        </p>
                      </div>
                    </div>

                    {/* 오른쪽 영역 (QR + 스위치) */}
                    <div className="flex items-center gap-4">
                      {/* [추가됨] QR 코드 썸네일 표시 */}
                      {origin && (
                        <div className="hidden sm:block p-1 bg-white border border-slate-200 rounded shadow-sm">
                          <QRCodeCanvas 
                            value={`${origin}/user/${user.id}/${qr.id}`}
                            size={48}
                            level="L"
                          />
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-1">
                          <Switch 
                            checked={qr.isActive} 
                            onCheckedChange={() => toggleQRStatus(qr.id, qr.isActive)} 
                          />
                          <span className="text-[10px] text-gray-400">{qr.isActive ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 하단 액션 버튼 */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <Link href={`/user/${user.id}/${qr.id}`} target="_blank">
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