// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // 분리한 파일에서 가져옴

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };