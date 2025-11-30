// app/qr/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QrCode, ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react"; // QR 코드 렌더링용

export default function QRRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", statusMessage: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // 생성 완료된 데이터 (성공 시 채워짐)
  const [createdQR, setCreatedQR] = useState<{ id: string, url: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // 입력 시 에러 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/qr/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // 성공 시 결과 화면 보여주기 위해 상태 업데이트
        setCreatedQR({ id: data.qrCode.id, url: data.url });
      } else {
        // 중복 등 에러 처리
        if (data.error === "DUPLICATE_NAME") {
          setErrorMsg("⚠️ 이미 사용 중인 이름입니다. 다른 이름을 입력해주세요.");
        } else {
          setErrorMsg(data.message || "생성에 실패했습니다.");
        }
      }
    } catch {
      setErrorMsg("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- [화면 2] 생성 완료 결과 화면 ---
  if (createdQR) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-2 border-green-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-700">QR 코드가 생성되었습니다!</CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center space-y-6">
            {/* QR 코드 표시 */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <QRCodeCanvas 
                value={createdQR.url}
                size={180}
                level="H"
              />
            </div>

            {/* 입력 정보 확인 */}
            <div className="w-full bg-slate-50 p-4 rounded-lg text-center space-y-1">
              <p className="font-bold text-lg text-slate-800">{formData.name}</p>
              <p className="text-sm text-slate-600">"{formData.statusMessage || "메시지 없음"}"</p>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setCreatedQR(null); // 다시 입력 화면으로
                  setFormData({ name: "", statusMessage: "" });
                }}
              >
                추가 생성
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/")}
              >
                확인 (홈으로)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- [화면 1] 입력 폼 화면 ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex items-center mb-6">
        <Link href="/" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold ml-2">새 QR 만들기</h1>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>QR 정보를 입력해주세요</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">QR 이름 *</label>
              <Input 
                name="name"
                placeholder="예: 내 차, 안방 문패" 
                value={formData.name}
                onChange={handleChange}
                required
                className={errorMsg ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {/* 중복 에러 메시지 출력 */}
              {errorMsg && (
                <p className="text-xs text-red-500 font-medium animate-pulse">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">상태 메시지</label>
              <Textarea 
                name="statusMessage"
                placeholder="예: 잠시 주차 중입니다. 전화주세요." 
                value={formData.statusMessage}
                onChange={handleChange}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !formData.name}
            >
              {isLoading ? "확인 중..." : "저장하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}