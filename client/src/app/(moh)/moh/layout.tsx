import { UserProvider } from "@/context/UserContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider roles={["moh"]}>{children}</UserProvider>;
}
