"use client";

import { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  ControlBar, 
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { AudioPresets, Participant } from "livekit-client"; 
import { Button } from "@/components/ui/button";
import { PhoneOff, User, Loader2, Mic, Volume2 } from "lucide-react"; // 아이콘 추가
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams 추가

export default function CallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에 ?mode=visitor 가 있으면 방문자로 인식
  const isVisitor = searchParams.get("mode") === "visitor";

  useEffect(() => {
    params.then((p) => {
        // [핵심] 역할에 따라 이름 규칙을 다르게 적용
        // 주인이면 'owner-host', 방문자면 'visitor-123' 
        const username = isVisitor 
            ? `visitor-${Math.floor(Math.random() * 1000)}` 
            : `owner-host`; // 주인은 고정된 이름 사용 권장 (혹은 중복 방지 처리)

        console.log(`>> 접속 시도 | Room: ${p.roomId} | Role: ${isVisitor ? '방문자' : '주인'} | User: ${username}`);

        fetch(`/api/livekit/token?room=${p.roomId}&username=${username}`)
          .then((res) => res.json())
          .then((data) => setToken(data.token))
          .catch(e => console.error("토큰 발급 실패:", e));
    });
  }, [params, isVisitor]);

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <span className="ml-3">{isVisitor ? "주인을 호출하는 중..." : "연결 준비 중..."}</span>
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
        connect={true}
        data-lk-theme="default"
        options={{
          publishDefaults: {
            audioPreset: AudioPresets.speech,
            dtx: true,
          },
          adaptiveStream: true,
        }}
        // 연결 종료 시 처리
        onDisconnected={() => {
            alert("통화가 종료되었습니다.");
            // 방문자는 닫기, 주인은 메인으로
            if (isVisitor && window.opener) { 
                window.close();
            } else {
                router.push("/");
            }
        }}
        className="flex flex-col items-center justify-between w-full h-full max-w-md p-6"
      >
        <RoomAudioRenderer volume={1.0} />
        
        {/* 역할에 따라 다른 UI 표시 */}
        {isVisitor ? <VisitorUI /> : <OwnerUI />}

        <div className="w-full pb-10 space-y-6">
           <div className="flex justify-center">
             <ControlBar 
                variation="minimal" 
                controls={{ microphone: true, camera: false, screenShare: false, chat: false }} 
             />
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

// --- [UI 컴포넌트 분리] ---

// 1. 주인용 UI (방문자를 기다리는 화면)
function OwnerUI() {
  const participants = useParticipants();
  // 나(owner)를 제외한 다른 사람이 있는지 확인
  const isVisitorConnected = participants.length > 1;

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-500 ${isVisitorConnected ? 'bg-green-900 border-green-500 animate-pulse' : 'bg-slate-800 border-slate-600'}`}>
        <User className={`h-16 w-16 ${isVisitorConnected ? 'text-green-400' : 'text-slate-400'}`} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {isVisitorConnected ? "방문자와 통화 중" : "방문자 대기 중..."}
        </h2>
        <p className={isVisitorConnected ? "text-green-400" : "text-slate-500"}>
          {isVisitorConnected ? "오디오 연결됨" : "상대방 접속을 기다리는 중"}
        </p>
      </div>
    </div>
  );
}

// 2. 방문자용 UI (통화 연결된 화면)
function VisitorUI() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
      <div className="w-40 h-40 bg-slate-900 rounded-full flex items-center justify-center border-4 border-green-500 animate-pulse">
        <Volume2 className="h-20 w-20 text-green-400" />
      </div>
      <div className="text-center">
         <h2 className="text-3xl font-bold text-green-400">연결되었습니다</h2>
         <p className="text-slate-400 mt-2 text-lg">말씀하시면 주인에게 들립니다</p>
      </div>
    </div>
  );
}