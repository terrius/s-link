"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Phone, MessageCircle, User, CheckCircle, PhoneOff } from "lucide-react"

import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";

// 1. Props 타입 정의
interface Props {
  qrData: {
    id: string;
    name: string;
    statusMessage: string | null;
    isActive: boolean;
    createdAt: string; // ✨ 여기 추가
    updatedAt: string; // ✨ 여기 추가
  };
  ownerData: {
    name: string;
    email: string;
  };
}

export default function UserConnectionClient({ qrData, ownerData }: Props) {
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [connectionSent, setConnectionSent] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false);
  const [token, setToken] = useState("");

  // 2. 통화 시작 로직 (실제 방 이름 사용)
  const handleCallStart = async () => {
    try {
      // 방 이름: qr-{QR아이디} (고유값)
      const roomName = `qr-${qrData.id}`;
      const username = `guest-${Math.floor(Math.random() * 1000)}`;

      const resp = await fetch(
        `/api/livekit/token?room=${roomName}&username=${username}`
      );
      
      if (!resp.ok) throw new Error("Token fetch failed");
      
      const data = await resp.json();
      setToken(data.token);
      setIsCallActive(true);
    } catch (e) {
      console.error(e);
      alert("통화 연결에 실패했습니다.");
    }
  };

  const handleCallEnd = () => {
    setIsCallActive(false);
    setToken("");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return
    // TODO: 나중에 실제 메시지 전송 API 연결 필요
    setConnectionSent(true)
  }

  // 3. 통화 화면
  if (isCallActive && token) {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-white">
        <LiveKitRoom
          video={false}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={handleCallEnd}
          className="flex flex-col items-center gap-8 w-full max-w-md p-6"
        >
          <RoomAudioRenderer />
          <div className="text-center space-y-4 animate-pulse">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto ring-4 ring-blue-400/30">
              <Phone className="h-10 w-10 text-white" />
            </div>
            {/* 실제 주인 이름 표시 */}
            <h2 className="text-2xl font-bold">{ownerData.name}님과 연결 중...</h2>
            <p className="text-gray-300">잠시만 기다려주세요.</p>
          </div>
          
          <div className="flex gap-6 mt-8">
             <ControlBar variation="minimal" controls={{ microphone: true, camera: false, screenShare: false, chat: false }} />
             <Button 
               variant="destructive" size="icon" 
               className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
               onClick={handleCallEnd}
             >
               <PhoneOff className="h-6 w-6" />
             </Button>
           </div>
        </LiveKitRoom>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          {/* 실제 데이터 바인딩 */}
          <CardTitle className="text-xl">{ownerData.name}</CardTitle>
          <CardDescription>{qrData.name}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 상태 메시지 표시 */}
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