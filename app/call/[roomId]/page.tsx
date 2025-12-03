"use client";

import { useEffect, useState } from "react";
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  ControlBar, 
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
// [수정 1] AudioPresets 추가 Import
import { Track, AudioPresets } from "livekit-client"; 
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
            // [수정 2] 문자열 'speech' 대신 AudioPresets 상수를 사용
            audioPreset: AudioPresets.speech, 
            dtx: true,
          },
          adaptiveStream: true,
        }}
        onConnected={() => console.log(">> LiveKit 서버에 연결 성공!")}
        onDisconnected={() => {
            alert("통화가 종료되었습니다.");
            if (window.opener) window.close();
            else router.push("/");
        }}
        onError={(error) => {
          console.error(">> LiveKit 에러 발생:", error);
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
  const audioTracks = useTracks([Track.Source.Microphone]);
  
  // 나(Local)를 제외한 트랙이 있는지 확인 (즉, 방문자가 들어왔는지)
  const isVisitorConnected = audioTracks.some(track => !track.participant.isLocal); 

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl ${isVisitorConnected ? 'bg-green-900 border-green-500 animate-pulse' : 'bg-slate-800 border-slate-600'}`}>
        <User className={`h-16 w-16 ${isVisitorConnected ? 'text-green-400' : 'text-slate-400'}`} />
      </div>
      <div className="text-center">
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