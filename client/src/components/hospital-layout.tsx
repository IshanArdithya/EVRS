"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { hospitalnavigation } from "@/constants/dashboard-layout";
import { HospitalUser } from "@/types";

interface HospitalLayoutProps {
  children: React.ReactNode;
}

export function HospitalLayout({ children }: HospitalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HospitalUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("hospital");
    if (storedUser) {
      try {
        const parsedUser: HospitalUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        setCurrentUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout/hospital`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        router.replace("/hospital/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const NavItems = () => (
    <>
      {hospitalnavigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* desktop sidebar */}
      <div className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">EVRS</h1>
            <p className="text-xs text-muted-foreground">Hospital</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItems />
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 text-sm">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                {currentUser?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* mobile ui */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">EVRS</span>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center gap-2 border-b px-6">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-lg font-semibold">EVRS</h1>
                  <p className="text-xs text-muted-foreground">Hospital</p>
                </div>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                <NavItems />
              </nav>
              <div className="border-t p-4">
                <div className="flex items-center gap-3 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>
                      {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* desktop main content */}
      <div className="hidden flex-1 flex-col lg:flex">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {hospitalnavigation.find((item) => item.href === pathname)
                ?.name || "Dashboard"}
            </h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
