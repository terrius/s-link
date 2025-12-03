"use client";

import { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  ControlBar, 
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, AudioPresets } from "livekit-client"; // AudioPresets 필수!
import { Button } from "@/components/ui/button";
import { PhoneOff, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OwnerCallPage({ params }: { params: Promise<{ roomId: string }> }) {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
        const username = `owner-host-${Math.floor(Math.random() * 10000)}`; 
        fetch(`/api/livekit/token?room=${p.roomId}&username=${username}`)
          .then((res) => res.json())
          .then((data) => setToken(data.token))
          .catch(e => console.error("토큰 발급 실패:", e));
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
        connect={true}
        data-lk-theme="default"
        options={{
          publishDefaults: {
            audioPreset: AudioPresets.speech, // 여기 에러 수정됨
            dtx: true,
          },
          adaptiveStream: true,
        }}
        // [수정 1] 상대방이 나가면 바로 메인으로 이동
        onParticipantDisconnected={() => {
            alert("상대방이 통화를 종료했습니다.");
            router.push("/");
        }}
        // [수정 2] 내가 연결 끊어도 메인으로 이동
        onDisconnected={() => {
            router.push("/");
        }}
        className="flex flex-col items-center justify-between w-full h-full max-w-md p-6"
      >
        <RoomAudioRenderer volume={1.0} />
        <ConnectionStatusDisplay />

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

function ConnectionStatusDisplay() {
  const participants = useParticipants();
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
          {isVisitorConnected ? "상대방이 접속했습니다" : "상대방 접속을 기다리는 중"}
        </p>
      </div>
    </div>
  );
}