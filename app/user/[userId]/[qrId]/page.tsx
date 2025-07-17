// app/user/[userId]/[qrId]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import UserConnectionClient from "./UserConnectionClient"

export default function Page(props: any) {
  return <UserConnectionClient params={props.params} />;
}
