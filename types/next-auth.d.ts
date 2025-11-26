// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

// next-auth 모듈의 타입을 확장합니다.
declare module "next-auth" {
  /**
   * Session 객체에 id 속성을 추가합니다.
   * 기존 DefaultSession["user"] (name, email, image)를 상속받으면서 id를 더합니다.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}
