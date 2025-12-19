"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/redux/features/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  LayoutDashboard,
  Home,
  Settings,
  LogOut,
  Bell,
  Plus,
  Menu,
} from "lucide-react";

export default function EmployeeLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { name: "My Properties", href: "/employee/properties", icon: Home },
    { name: "Settings", href: "/employee/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/employee") return pathname === "/employee";
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // ✅ SAFE INITIALS FUNCTION (NO CRASH)
  const getUserInitials = () => {
    if (!user?.name) return "EU";

    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const sidebarContent = (
    <nav className="flex flex-col gap-2 flex-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-blue-600 text-white"
              : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 h-screen px-4 py-6 bg-white dark:bg-slate-900 border-r dark:border-slate-800 sticky top-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <span className="text-xl font-bold">EstateHub</span>
        </div>

        {sidebarContent}

        {/* USER PROFILE */}
        {user && (
          <div className="mt-auto p-2 border-t dark:border-slate-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent transition-colors">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">
                      {user.name || "Employee"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/employee/settings")}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b dark:border-slate-800">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-2 mb-8">
                  <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white dark:text-slate-900" />
                  </div>
                  <span className="text-xl font-bold">EstateHub</span>
                </div>
                {sidebarContent}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/employee/properties/add")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
