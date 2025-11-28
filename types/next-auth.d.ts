// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  // 1. 세션(Session) 객체 확장
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }

  // 2. 유저(User) 객체 확장 (이게 빠져서 에러가 났을 수 있습니다)
  interface User extends DefaultUser {
    role: Role
  }
}