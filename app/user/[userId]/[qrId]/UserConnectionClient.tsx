"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Phone, MessageCircle, User, CheckCircle } from "lucide-react"

export default function UserConnectionClient({ params }: { params: { userId: string; qrId: string } }) {
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionSent, setConnectionSent] = useState(false)

  // Mock user data - in real app, this would be fetched based on userId and qrId
  const userData = {
    name: "김철수",
    title: "아파트 101동 1205호",
    message: "안녕하세요! 방문 전에 미리 연락 부탁드립니다.",
    isAvailable: true,
    qrType: params.qrId.includes("home") ? "home" : params.qrId.includes("car") ? "car" : "general",
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    setConnectionSent(true)
    // In real app, this would send the message to the QR owner
  }

  const handleCallRequest = () => {
    setIsConnecting(true)
    // In real app, this would initiate UC call
    setTimeout(() => {
      setIsConnecting(false)
      alert("통화 연결 중입니다...")
    }, 2000)
  }

  if (connectionSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">메시지가 전송되었습니다</h2>
            <p className="text-gray-600 mb-4">{userData.name}님에게 연락 요청이 전달되었습니다.</p>
            <p className="text-sm text-gray-500">곧 연락을 받으실 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">{userData.name}</CardTitle>
          <CardDescription>{userData.title}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User's Message */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">{userData.message}</p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${userData.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-600">{userData.isAvailable ? "연결 가능" : "연결 불가"}</span>
          </div>

          {userData.isAvailable && (
            <>
              {/* Message Form */}
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!message.trim()}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  메시지 보내기 이렇게 보냅시다
                </Button>

                <Button onClick={handleCallRequest} variant="outline" className="w-full" disabled={isConnecting}>
                  <Phone className="h-4 w-4 mr-2" />
                  {isConnecting ? "연결 중..." : "바로 통화하기"}
                </Button>
              </div>
            </>
          )}

          {!userData.isAvailable && (
            <div className="text-center py-4">
              <p className="text-gray-500">현재 연결할 수 없습니다</p>
              <p className="text-sm text-gray-400 mt-1">나중에 다시 시도해주세요</p>
            </div>
          )}
        </CardContent>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Shield className="h-3 w-3" />
            <span>S-Link 안전 연결 서비스 이제 곧 런칭합니다</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
