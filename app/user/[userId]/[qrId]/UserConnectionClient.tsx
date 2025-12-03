"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // 라우터 추가
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Phone, MessageCircle, User, CheckCircle } from "lucide-react"

// LiveKit 관련 import는 이제 여기서 필요 없으므로 삭제했습니다.

interface Props {
  qrData: {
    id: string;
    name: string;
    statusMessage: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  ownerData: {
    name: string;
    email: string;
  };
}

export default function UserConnectionClient({ qrData, ownerData }: Props) {
  const router = useRouter(); // 이동을 위한 훅
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [connectionSent, setConnectionSent] = useState(false)

  // 메시지 전송 로직 (기존 유지)
  const handleSendMessage = () => {
    if (!message.trim()) return
    // TODO: 메시지 전송 API 구현 필요
    setConnectionSent(true)
  }

  // ✅ [수정된 부분] 통화 버튼 클릭 시 이동 로직
  const handleCallStart = () => {
    // 1. 방 ID는 QR ID를 사용
    // 2. 뒤에 ?mode=visitor 를 붙여서 방문자 모드로 접속
    router.push(`/call/${qrData.id}?mode=visitor`);
  };

  // 메시지 전송 완료 화면
  if (connectionSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">메시지가 전송되었습니다</h2>
            <p className="text-gray-600 mb-4">{ownerData.name}님에게 연락 요청이 전달되었습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 메인 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">{ownerData.name}</CardTitle>
          <CardDescription>{qrData.name}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 상태 메시지 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              {qrData.statusMessage || "등록된 상태 메시지가 없습니다."}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${qrData.isActive ? "bg-green-500" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-600">{qrData.isActive ? "연결 가능" : "연결 불가"}</span>
          </div>

          {qrData.isActive && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sender-name">성함 (선택사항)</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                  />
                </div>
                <div>
                  <Label htmlFor="message">메시지</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="전달할 메시지를 입력해주세요"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleSendMessage} className="w-full bg-blue-600 hover:bg-blue-700" disabled={!message.trim()}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  메시지 보내기
                </Button>

                {/* ✅ 바로 통화하기 버튼 */}
                <Button onClick={handleCallStart} variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  바로 통화하기
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            <span>S-Link 안전 연결 서비스</span>
          </div>
        </div>
      </Card>
    </div>
  )
}