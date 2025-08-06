import { UserProvider } from "@/context/UserContext";

export default function HcpLayout({ children }: { children: React.ReactNode }) {
  return <UserProvider roles={["hcp"]}>{children}</UserProvider>;
}
