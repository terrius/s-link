"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  QrCode,
  User,
  ArrowLeft,
  Download,
  Copy,
  Settings,
  Home,
  Car,
  Plus,
  Trash2,
  Edit,
  BarChart3,
} from "lucide-react"

export default function SettingsPage() {
  const [qrCodes, setQrCodes] = useState([
    {
      id: "home001",
      name: "우리집 현관문",
      type: "home",
      url: "https://s-link.com/u/kimcs/home001",
      scans: 12,
      lastUsed: "2시간 전",
      isActive: true,
    },
    {
      id: "car001",
      name: "내 차량",
      type: "car",
      url: "https://s-link.com/u/kimcs/car001",
      scans: 5,
      lastUsed: "1일 전",
      isActive: true,
    },
  ])

  const [settings, setSettings] = useState({
    notifications: true,
    autoAccept: false,
    soundAlerts: true,
    emailNotifications: true,
  })

  const generateNewQR = () => {
    const newId = `qr${Date.now()}`
    const newQR = {
      id: newId,
      name: "새 QR 코드",
      type: "general",
      url: `https://s-link.com/u/kimcs/${newId}`,
      scans: 0,
      lastUsed: "방금 전",
      isActive: true,
    }
    setQrCodes([...qrCodes, newQR])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("링크가 복사되었습니다!")
  }

  const toggleQRStatus = (id: string) => {
    setQrCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, isActive: !qr.isActive } : qr)))
  }

  const deleteQR = (id: string) => {
    if (confirm("정말로 이 QR 코드를 삭제하시겠습니까?")) {
      setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">설정 관리</h1>
                <p className="text-sm text-gray-500">QR 코드와 서비스 설정을 관리하세요</p>
              </div>
            </div>
            <Button onClick={generateNewQR} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />새 QR 생성
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - QR Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Codes Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  QR 코드 관리
                </CardTitle>
                <CardDescription>생성된 QR 코드들을 관리하고 사용 현황을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qrCodes.map((qr) => (
                    <div key={qr.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {qr.type === "home" && <Home className="h-6 w-6 text-blue-600" />}
                            {qr.type === "car" && <Car className="h-6 w-6 text-green-600" />}
                            {qr.type === "general" && <QrCode className="h-6 w-6 text-gray-600" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{qr.name}</h3>
                            <p className="text-sm text-gray-500">
                              스캔 {qr.scans}회 · {qr.lastUsed}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={qr.isActive} onCheckedChange={() => toggleQRStatus(qr.id)} />
                          <span className="text-xs text-gray-500">{qr.isActive ? "활성" : "비활성"}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-600 mb-3">{qr.url}</div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(qr.url)}>
                            <Copy className="h-4 w-4 mr-1" />
                            복사
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            다운로드
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            통계
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQR(qr.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  서비스 설정
                </CardTitle>
                <CardDescription>알림 및 자동 응답 설정을 관리하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>푸시 알림</Label>
                    <p className="text-sm text-gray-500">새로운 연결 요청 시 알림 받기</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>소리 알림</Label>
                    <p className="text-sm text-gray-500">알림 시 소리로 알려주기</p>
                  </div>
                  <Switch
                    checked={settings.soundAlerts}
                    onCheckedChange={(checked) => setSettings({ ...settings, soundAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>이메일 알림</Label>
                    <p className="text-sm text-gray-500">중요한 알림을 이메일로 받기</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>자동 수락</Label>
                    <p className="text-sm text-gray-500">신뢰할 수 있는 연락처 자동 수락</p>
                  </div>
                  <Switch
                    checked={settings.autoAccept}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoAccept: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account & Stats */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  계정 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-medium">김철수</h3>
                  <p className="text-sm text-gray-500">kimcs@example.com</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">가입일</span>
                    <span>2024.01.15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">플랜</span>
                    <span className="text-blue-600 font-medium">기본 플랜</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상태</span>
                    <span className="text-green-600 font-medium">활성</span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full">
                      프로필 수정
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    플랜 업그레이드
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>이번 달 사용량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">QR 스캔</span>
                    <span className="font-medium">{qrCodes.reduce((sum, qr) => sum + qr.scans, 0)}회</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">연결 요청</span>
                    <span className="font-medium">8건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">통화 연결</span>
                    <span className="font-medium">5건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">응답률</span>
                    <span className="font-medium text-green-600">87.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  비밀번호 변경
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  2단계 인증 설정
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  로그인 기록 확인
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  계정 삭제
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
