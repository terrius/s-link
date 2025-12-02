"use client";

import { useState } from "react";
import { 
  Shield, 
  Phone, 
  MessageCircle, 
  User, 
  CheckCircle, 
  PhoneOff, 
  Loader2 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// LiveKit Imports
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";

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
  // 상태 관리
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [connectionSent, setConnectionSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 통화 관련 상태
  const [isCallActive, setIsCallActive] = useState(false);
  const [token, setToken] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  // --- [기능 1] 메시지 전송 핸들러 ---
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrCodeId: qrData.id,
          senderName: senderName,
          content: message
        }),
      });

      if (res.ok) {
        setConnectionSent(true);
      } else {
        alert("메시지 전송에 실패했습니다.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  // --- [기능 2] 통화 연결 핸들러 (업데이트됨) ---
  const handleCallStart = async () => {
    setIsCalling(true);
    try {
      // 1. 방 이름 생성 (유니크)
      const roomName = `call-${qrData.id}-${Date.now()}`;
      const username = `guest-${Math.floor(Math.random() * 1000)}`;

      // 2. [NEW] DB에 통화 요청 기록 (소유자가 알 수 있게)
      const reqRes = await fetch("/api/call/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeId: qrData.id, roomName }),
      });

      if (!reqRes.ok) throw new Error("Call request failed");

      // 3. LiveKit 토큰 발급
      const tokenRes = await fetch(
        `/api/livekit/token?room=${roomName}&username=${username}`
      );
      
      if (!tokenRes.ok) throw new Error("Token fetch failed");
      
      const data = await tokenRes.json();
      setToken(data.token);
      setIsCallActive(true); // 통화 화면 진입

    } catch (e) {
      console.error(e);
      alert("통화 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsCalling(false);
    }
  };

  // 통화 종료 핸들러
  const handleCallEnd = () => {
    setIsCallActive(false);
    setToken("");
  };

  // --- [화면 1] 통화 중 화면 ---
  if (isCallActive && token) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 text-white">
        <LiveKitRoom
          video={false}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={handleCallEnd}
          className="flex flex-col items-center justify-between w-full h-full max-w-md p-6"
        >
          <RoomAudioRenderer />
          
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-2xl">
                <User className="h-16 w-16 text-slate-400" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{ownerData.name}</h2>
              <p className="text-blue-400 font-medium">연결 중입니다...</p>
              <p className="text-xs text-slate-500">상대방이 수락하면 연결됩니다.</p>
            </div>
          </div>

          <div className="w-full pb-10 space-y-6">
             <div className="flex justify-center">
               <ControlBar 
                  variation="minimal" 
                  controls={{ microphone: true, camera: false, screenShare: false, chat: false }} 
               />
             </div>
             <Button 
               variant="destructive" 
               className="w-full h-14 rounded-full text-lg font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
               onClick={handleCallEnd}
             >
               <PhoneOff className="h-6 w-6" />
               통화 종료
             </Button>
           </div>
        </LiveKitRoom>
      </div>
    );
  }

  // --- [화면 2] 전송 완료 화면 ---
  if (connectionSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center py-10">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">전송 완료!</h2>
            <p className="text-gray-600 mb-4">
              메시지를 안전하게 전달했습니다.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setConnectionSent(false); 
                setMessage(""); 
              }}
            >
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- [화면 3] 기본 화면 ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">{ownerData.name}</CardTitle>
          <CardDescription>{qrData.name}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              &quot;{qrData.statusMessage || "등록된 상태 메시지가 없습니다."}&quot;
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-green-50 py-2 rounded-full w-fit mx-auto px-4">
            <div className={`w-2.5 h-2.5 rounded-full ${qrData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-xs font-bold text-green-700">
              {qrData.isActive ? "실시간 연결 가능" : "연결 불가"}
            </span>
          </div>

          {qrData.isActive && (
            <>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">성함 (선택사항)</Label>
                  <Input
                    id="sender-name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="이름을 남기면 더 빨리 확인해요"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">메시지</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="용건을 입력해주세요"
                    rows={3}
                    className="bg-white resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleSendMessage} 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-md transition-all active:scale-95" 
                  disabled={!message.trim() || isSending}
                >
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5 mr-2" />}
                  {isSending ? "전송 중..." : "메시지 보내기"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">OR</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCallStart} 
                  variant="outline" 
                  className="w-full h-12 text-lg border-2 border-slate-200 hover:bg-slate-50 text-slate-700"
                  disabled={isCalling}
                >
                  {isCalling ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Phone className="h-5 w-5 mr-2 text-green-600" />}
                  {isCalling ? "연결 시도 중..." : "바로 통화하기"}
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <div className="px-6 pb-6 text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            개인정보는 안전하게 보호됩니다
          </p>
        </div>
      </Card>
    </div>
  )
}