// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      if (res.ok) {
        router.push("/"); // 메인으로 이동
        router.refresh();
      } else {
        alert("닉네임 설정에 실패했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">프로필 설정</h1>
          <p className="text-slate-500 mt-2">
            S-Link에서 사용할 닉네임을 입력해주세요.<br/>
            이 이름은 상대방에게 표시됩니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="예: 홍길동, 101동 입주민"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-lg py-6 text-center"
              maxLength={10}
              required
            />
            <p className="text-xs text-center text-slate-400 mt-2">
              최대 10글자까지 입력 가능합니다.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || nickname.length < 2}
          >
            {isLoading ? "설정 중..." : "S-Link 시작하기"}
          </Button>
        </form>
      </Card>
    </div>
  );
}