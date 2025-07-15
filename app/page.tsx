"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Shield,
  QrCode,
  User,
  Phone,
  MessageCircle,
  Settings,
  Download,
  RefreshCw,
  Bell,
  Menu,
  Home,
  Car,
  BarChart3,
  HelpCircle,
  LogOut,
} from "lucide-react"

export default function MainDashboard() {
  const [recentConnections, setRecentConnections] = useState([
    {
      id: 1,
      qrId: "home001",
      message: "택배 배송 왔습니다",
      time: "10분 전",
      status: "answered",
      senderName: "배송기사",
    },
    {
      id: 2,
      qrId: "car001",
      message: "차량 이동 부탁드립니다",
      time: "2시간 전",
      status: "pending",
      senderName: "익명",
    },
    {
      id: 3,
      qrId: "home001",
      message: "방문 예정입니다",
      time: "1일 전",
      status: "answered",
      senderName: "김방문",
    },
  ])

  const [qrCodes] = useState([
    {
      id: "home001",
      name: "우리집 현관문",
      type: "home",
      scans: 12,
      lastUsed: "2시간 전",
    },
    {
      id: "car001",
      name: "내 차량",
      type: "car",
      scans: 5,
      lastUsed: "1일 전",
    },
  ])

  const handleCallResponse = (connectionId: number, action: "accept" | "decline") => {
    setRecentConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId ? { ...conn, status: action === "accept" ? "answered" : "declined" } : conn,
      ),
    )

    if (action === "accept") {
      alert("통화 연결 중입니다...")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Person Icon - Links to Settings */}
            <Link href="/settings" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">S-Link Dashboard</h1>
                <p className="text-xs text-gray-500">김철수님</p>
              </div>
            </Link>

            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    S-Link 메뉴
                  </SheetTitle>
                  <SheetDescription>서비스 메뉴를 선택하세요</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link
                    href="/"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Home className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">대시보드</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-green-600" />
                    <span className="font-medium">내 프로필</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">설정 관리</span>
                  </Link>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <QrCode className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">QR 코드 관리</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">사용 통계</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <HelpCircle className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">도움말</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-red-600">
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live QR Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                실시간 QR 코드
              </CardTitle>
              <CardDescription>현재 활성화된 QR 코드</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">QR 코드 영역</p>
                  <p className="text-xs text-gray-400 mt-1">실제 QR 이미지가 표시됩니다</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  QR 코드 다운로드
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로 생성
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>사용 통계</CardTitle>
              <CardDescription>오늘의 활동 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">총 QR 코드</span>
                  </div>
                  <span className="font-bold text-blue-600">{qrCodes.length}개</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">총 스캔 수</span>
                  </div>
                  <span className="font-bold text-green-600">{qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}회</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">미답변 요청</span>
                  </div>
                  <span className="font-bold text-orange-600">
                    {recentConnections.filter((c) => c.status === "pending").length}건
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Connections - Full Width */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              최근 연결 요청
            </CardTitle>
            <CardDescription>QR 코드를 통한 연결 요청 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConnections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {qrCodes.find((qr) => qr.id === connection.qrId)?.type === "home" && (
                            <Home className="h-4 w-4 text-blue-600" />
                          )}
                          {qrCodes.find((qr) => qr.id === connection.qrId)?.type === "car" && (
                            <Car className="h-4 w-4 text-green-600" />
                          )}
                          <span className="text-sm font-medium text-gray-600">
                            {qrCodes.find((qr) => qr.id === connection.qrId)?.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{connection.time}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{connection.message}</p>
                      <p className="text-xs text-gray-500">보낸이: {connection.senderName}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {connection.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleCallResponse(connection.id, "accept")}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            통화
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCallResponse(connection.id, "decline")}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            메시지
                          </Button>
                        </>
                      )}
                      {connection.status === "answered" && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                          응답완료
                        </span>
                      )}
                      {connection.status === "declined" && (
                        <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">거절됨</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {recentConnections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>아직 연결 요청이 없습니다</p>
                <p className="text-sm mt-1">QR 코드를 공유해보세요!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
