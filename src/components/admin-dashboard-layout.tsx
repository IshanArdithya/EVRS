"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  LayoutDashboard,
  UserPlus,
  Baby,
  Syringe,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Building2,
  Users,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Hospitals",
    href: "/admin/dashboard/manage-hospitals",
    icon: Building2,
  },
  {
    name: "Manage MOH",
    href: "/admin/dashboard/manage-moh",
    icon: Users,
  },
  {
    name: "Manage Healthcare Providers",
    href: "/admin/dashboard/manage-healthcare-providers",
    icon: UserPlus,
  },
  {
    name: "Manage Citizens",
    href: "/admin/dashboard/manage-citizens",
    icon: Baby,
  },
  {
    name: "Manage Vaccination Records",
    href: "/admin/dashboard/manage-vaccination-records",
    icon: Syringe,
  },
  {
    name: "Manage Vaccines",
    href: "/admin/dashboard/manage-vaccines",
    icon: Plus,
  },
  {
    name: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b border-red-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* logo & mobile menu */}
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
                <Shield className="h-6 w-6 text-red-600" />
                <span className="text-xl font-bold text-red-600">
                  EVRS Admin
                </span>
              </div>
            </div>

            {/* user menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-red-600 text-white">
                        A
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Administrator</p>
                      <p className="text-xs text-muted-foreground">
                        admin@evrs.gov.lk
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
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
          } fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-red-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]`}
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
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* overlay - mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* main content */}
        <main className="flex-1 ">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
