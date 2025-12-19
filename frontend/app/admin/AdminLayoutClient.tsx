"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/redux/features/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Loader2,
  Menu,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: Home },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };

  const getUserInitials = () =>
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "AD";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r">
      <div className="flex items-center gap-2 px-6 h-16 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">EstateHub</span>
      </div>

      <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileOpen(false)}
          >
            <Button
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10 mb-1",
                isActive(item.href) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t bg-gray-50 dark:bg-slate-900">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
              <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                <AvatarImage src={user?.image} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-left overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content Wrapper */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">EstateHub</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search properties..."
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              className="hidden sm:flex"
              onClick={() => router.push("/admin/properties/add")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button
              size="icon"
              className="sm:hidden h-8 w-8"
              onClick={() => router.push("/admin/properties/add")}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
