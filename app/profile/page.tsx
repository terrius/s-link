"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Shield, User, ArrowLeft, Eye, Save, Upload, Camera, MapPin, Clock, Phone } from "lucide-react"

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState({
    name: "김철수",
    title: "아파트 101동 1205호",
    message: "안녕하세요! 방문 전에 미리 연락 부탁드립니다.",
    phone: "010-1234-5678",
    email: "kimcs@example.com",
    address: "서울시 강남구 테헤란로 123",
    isAvailable: true,
    autoReply: true,
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = () => {
    alert("프로필이 저장되었습니다!")
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl">{userProfile.name}</CardTitle>
            <CardDescription>{userProfile.title}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">{userProfile.message}</p>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${userProfile.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-sm text-gray-600">{userProfile.isAvailable ? "연결 가능" : "연결 불가"}</span>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">메시지 보내기</Button>
              <Button variant="outline" className="w-full">
                바로 통화하기
              </Button>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <Button variant="ghost" className="w-full" onClick={() => setPreviewMode(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              편집으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    )
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
                <h1 className="text-lg font-bold text-gray-900">내 프로필 관리</h1>
                <p className="text-sm text-gray-500">다른 사람이 보게 될 프로필을 설정하세요</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                미리보기
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                프로필 사진
              </CardTitle>
              <CardDescription>방문자에게 보여질 프로필 이미지를 설정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <Button variant="outline" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    사진 업로드
                  </Button>
                  <p className="text-sm text-gray-500">JPG, PNG 파일만 가능 (최대 5MB)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                기본 정보
              </CardTitle>
              <CardDescription>방문자에게 표시될 기본 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름/제목 *</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    placeholder="예: 김철수, 101동 관리사무소"
                  />
                </div>
                <div>
                  <Label htmlFor="title">부제목</Label>
                  <Input
                    id="title"
                    value={userProfile.title}
                    onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })}
                    placeholder="예: 아파트 101동 1205호"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">주소/위치</Label>
                <div className="flex space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-2" />
                  <Input
                    id="address"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    placeholder="주소를 입력하세요"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">안내 메시지 *</Label>
                <Textarea
                  id="message"
                  value={userProfile.message}
                  onChange={(e) => setUserProfile({ ...userProfile, message: e.target.value })}
                  rows={3}
                  placeholder="방문자에게 전달할 메시지를 입력하세요"
                />
                <p className="text-xs text-gray-500 mt-1">{userProfile.message.length}/200자</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                연결 설정
              </CardTitle>
              <CardDescription>연결 가능 시간과 자동 응답을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>연결 가능 상태</Label>
                  <p className="text-sm text-gray-500">현재 연결 요청을 받을 수 있는지 설정</p>
                </div>
                <Switch
                  checked={userProfile.isAvailable}
                  onCheckedChange={(checked) => setUserProfile({ ...userProfile, isAvailable: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>자동 응답</Label>
                  <p className="text-sm text-gray-500">부재 중일 때 자동으로 메시지 전송</p>
                </div>
                <Switch
                  checked={userProfile.autoReply}
                  onCheckedChange={(checked) => setUserProfile({ ...userProfile, autoReply: checked })}
                />
              </div>

              <div>
                <Label className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  연결 가능 시간
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time" className="text-sm">
                      시작 시간
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={userProfile.workingHours.start}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          workingHours: { ...userProfile.workingHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time" className="text-sm">
                      종료 시간
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={userProfile.workingHours.end}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          workingHours: { ...userProfile.workingHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                개인정보 설정
              </CardTitle>
              <CardDescription>개인정보 보호 및 보안 설정</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">이메일 (비공개)</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  placeholder="알림 수신용 이메일"
                />
              </div>

              <div>
                <Label htmlFor="phone">전화번호 (비공개)</Label>
                <Input
                  id="phone"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  placeholder="UC 통화 연결용"
                />
                <p className="text-xs text-gray-500 mt-1">* 이 정보는 방문자에게 노출되지 않습니다</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
