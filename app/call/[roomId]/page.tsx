// app/call/[roomId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer, ControlBar } from "@livekit/components-react";
import "@livekit/components-styles";
import { Button } from "@/components/ui/button";
import { PhoneOff, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OwnerCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const [token, setToken] = useState("");
  // roomName 상태 삭제 (사용하지 않음)
  const router = useRouter();

  useEffect(() => {
    // params 언래핑
    params.then((p) => {
        // 토큰 발급 요청
        const username = "owner-host"; 
        fetch(`/api/livekit/token?room=${p.roomId}&username=${username}`)
          .then((res) => res.json())
          .then((data) => setToken(data.token));
    });
  }, [params]);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <span className="ml-3">연결 준비 중...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 text-white">
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        onDisconnected={() => {
            alert("통화가 종료되었습니다.");
            // 팝업으로 열렸다면 닫기, 아니면 메인으로 이동
            if (window.opener) {
                window.close();
            } else {
                router.push("/");
            }
        }}
        className="flex flex-col items-center justify-between w-full h-full max-w-md p-6"
      >
        <RoomAudioRenderer />
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-green-500 shadow-2xl animate-pulse">
            <User className="h-16 w-16 text-slate-400" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">방문자 연결 중</h2>
            <p className="text-green-400">통화가 연결되었습니다</p>
          </div>
        </div>

        <div className="w-full pb-10 space-y-6">
           <div className="flex justify-center">
             <ControlBar variation="minimal" controls={{ microphone: true, camera: false, screenShare: false, chat: false }} />
           </div>
           <Button 
             variant="destructive" 
             className="w-full h-14 rounded-full text-lg font-bold bg-red-600 hover:bg-red-700"
             onClick={() => router.push("/")}
           >
             <PhoneOff className="h-6 w-6 mr-2" />
             통화 종료
           </Button>
         </div>
      </LiveKitRoom>
    </div>
  );
}