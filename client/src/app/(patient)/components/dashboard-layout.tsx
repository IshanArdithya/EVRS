"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Home,
  Syringe,
  User,
  HelpCircle,
  FileText,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import api from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { Spinner } from "@/components/ui/spinner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Vaccinations", href: "/dashboard/vaccinations", icon: Syringe },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Privacy Policy", href: "/dashboard/privacy", icon: FileText },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { citizen, loading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!citizen) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Please log in to view your dashboard.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout/citizen");

      if (res.status === 200) {
        router.replace("/login");
      } else {
        console.error("Logout failed with status:", res.status);
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b border-primary/20 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* logo and mobile menu */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">EVRS</span>
              </div>
            </div>

            {/* new vaccination btn and user menu */}
            <div className="flex items-center space-x-4">
              {/* new vaccination btn - desktop only */}
              <Button
                asChild
                className="hidden lg:flex bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                <Link
                  href="/dashboard/new-vaccination"
                  className="flex items-center"
                >
                  <Syringe className="mr-2 h-4 w-4" />
                  New Vaccination
                </Link>
              </Button>

              {/* user menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {citizen.firstName?.charAt(0).toUpperCase() || "U"}
                        {citizen.lastName?.charAt(0).toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {citizen.firstName} {citizen.lastName}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {citizen.citizenId}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/support">Help & Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-primary/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]`}
        >
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-DEFAULT text-white"
                        : "text-gray-700 hover:bg-primary/10 hover:text-primary"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* new vaccination btn - sidebar */}
              <div className="pt-2">
                <Link
                  href="/dashboard/new-vaccination"
                  className="flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Plus className="mr-3 h-5 w-5" />
                  New Vaccination +
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
