"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/redux/features/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Building2,
  LogOut,
  Settings,
  LayoutDashboard,
  Menu,
  Home,
  Users,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const getDashboardLink = () =>
    user?.role === "Admin" ? "/admin" : "/employee";
  const getUserInitials = () =>
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const navLinks = [
    { href: "/properties", label: "Properties", icon: Home },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/contact", label: "Contact Us", icon: Phone },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-5 w-24 sm:h-6 sm:w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md"></div>
          </Link>
          <div className="h-8 w-8 sm:h-10 sm:w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-black/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            EstateHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Desktop Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden sm:flex">
                  <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                    <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(getDashboardLink())}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`${getDashboardLink()}/settings`)
                    }
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Avatar in Sheet */}
              <div className="sm:hidden">
                <Avatar className="w-9 h-9 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:flex hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md text-sm sm:text-base px-4 sm:px-6"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              {/* User Info in Mobile Menu */}
              {user && (
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-slate-200 dark:border-slate-700">
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span>{link.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}

                {user && (
                  <>
                    <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>

                    <SheetClose asChild>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span>Dashboard</span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href={`${getDashboardLink()}/settings`}
                        className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span>Settings</span>
                      </Link>
                    </SheetClose>

                    <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log out</span>
                    </button>
                  </>
                )}

                {!user && (
                  <>
                    <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>

                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Sign In
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/signup"
                        className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-colors"
                      >
                        Get Started
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
