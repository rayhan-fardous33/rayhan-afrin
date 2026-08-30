"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Menu,
  X,
  LogOut,
  FilePlus,
  ClipboardList,
  Users,
  Camera,
  Heart,
  FileDown,
  Ban,
  ShieldAlert,
  Home,
  Mail,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import AccessDenied from "@/components/Dashboard/AccessDenied";
import { toast } from "react-toastify";

// Ambient floating hearts for the dashboard backdrop
const AmbientHeart = ({
  size,
  left,
  delay,
  duration,
  opacity = "opacity-15",
}) => (
  <div
    className={`absolute pointer-events-none z-0 ${opacity} text-rose-400`}
    style={{
      width: size,
      height: size,
      bottom: "-10%",
      left: left,
      animation: `dashboardFloat ${duration}s linear ${delay}s infinite`,
    }}
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </div>
);

const rayhanLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/allUsers", label: "All Users", icon: Users },
  {
    href: "/dashboard/allNotes",
    label: "Sweet Notes",
    icon: Mail,
  },
  {
    href: "/dashboard/allMemories",
    label: "All Memories",
    icon: Camera,
  },
  {
    href: "/dashboard/allDocuments",
    label: "Documents",
    icon: FileDown,
  },
];

const afrinLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  {
    href: "/dashboard/allNotes",
    label: "Sweet Notes",
    icon: Mail,
  },
  {
    href: "/dashboard/allMemories",
    label: "All Memories",
    icon: Camera,
  },
  {
    href: "/dashboard/allDocuments",
    label: "Documents",
    icon: FileDown,
  },
  {
    href: "/dashboard/create-request",
    label: "Create Request",
    icon: FilePlus,
  },
];

const baseUserLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const checkAccess = (pathname, role, isBlocked) => {
  if (isBlocked) return { allowed: false, allowedRoles: [] };

  const path = pathname.replace(/\/$/, "");
  const allRoles = ["user", "afrin", "rayhan"];

  if (path === "/dashboard" || path === "/dashboard/profile")
    return { allowed: true, allowedRoles: allRoles };

  if (path === "/dashboard/allUsers")
    return { allowed: role === "rayhan", allowedRoles: ["rayhan"] };

  if (path === "/dashboard/allMemories")
    return {
      allowed: role === "rayhan" || role === "afrin",
      allowedRoles: ["rayhan", "afrin"],
    };

  if (path === "/dashboard/allNotes")
    return {
      allowed: role === "rayhan" || role === "afrin",
      allowedRoles: ["rayhan", "afrin"],
    };

  if (path === "/dashboard/allDocuments")
    return {
      allowed: role === "rayhan" || role === "afrin",
      allowedRoles: ["rayhan", "afrin"],
    };
    
  if (path === "/dashboard/create-request") {
    return {
      allowed: role === "afrin",
      allowedRoles: ["afrin"],
    };
  }

  return { allowed: false, allowedRoles: ["rayhan", "afrin"] };
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const isBlocked =
    (session?.user?.status || "active").toLowerCase() === "blocked";
  const rawRole = (session?.user?.role || "user").toString().trim().toLowerCase();

  let role = "user";
  if (rawRole === "rayhan" || rawRole === "admin") {
    role = "rayhan";
  } else if (rawRole === "afrin") {
    role = "afrin";
  } else {
    role = "user";
  }

  // Redirect unauthenticated or blocked users
  useEffect(() => {
    if (!sessionLoading) {
      if (!session && !isLoggingOut) {
        router.push("/login");
      } else if (isBlocked) {
        toast.error("Your account has been blocked by Admin Rayhan. Access Denied!");
        (async () => {
          const { authClient } = await import("@/lib/auth-client");
          await authClient.signOut();
          router.push("/");
        })();
      }
    }
  }, [session, sessionLoading, isBlocked, router, isLoggingOut]);

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-rose-50 via-pink-100 to-rose-100">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-rose-400/30 rounded-full animate-ping opacity-75" />
          <div className="absolute w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-pulse" />
          <div className="relative transform transition-transform hover:scale-110">
            <svg
              className="w-16 h-16 text-rose-500 fill-current animate-[heartbeat_1.2s_infinite_ease-in-out]"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-8 text-sm font-semibold tracking-widest text-rose-600/80 uppercase animate-pulse">
          Loading our universe...
        </h2>
      </div>
    );
  }

  // IF BLOCKED: Do not display any dashboard components, show warning and redirect
  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-rose-900/60 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30 animate-pulse">
            <Ban size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              ACCOUNT BLOCKED
            </h2>
            <p className="text-xs text-rose-200/80 font-medium leading-relaxed">
              Your account has been blocked by Admin Rayhan. You are not allowed to view any dashboard components or features.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs font-bold text-rose-300 flex items-center justify-center gap-2">
            <ShieldAlert size={16} />
            Redirecting to Home Page...
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
          >
            <Home size={15} />
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  if (!session && !isLoggingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-rose-900/60 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30 animate-pulse">
            <ShieldAlert size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              AUTHENTICATION REQUIRED
            </h2>
            <p className="text-xs text-rose-200/80 font-medium leading-relaxed">
              Please sign in to access RayHan & Afrin's Orbit Dashboard.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
          >
            <User size={15} />
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  let sidebarLinks = baseUserLinks;
  if (role === "rayhan") {
    sidebarLinks = rayhanLinks;
  } else if (role === "afrin") {
    sidebarLinks = afrinLinks;
  } else {
    sidebarLinks = baseUserLinks;
  }

  const access = checkAccess(pathname, role, isBlocked);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      const { authClient } = await import("@/lib/auth-client");
      await authClient.signOut();
      router.push("/");
    }, 3000);
  };

  return (
    <div
      className={`luxury-dashboard h-dvh max-h-dvh overflow-hidden flex bg-linear-to-tr from-rose-50/40 via-pink-50/20 to-slate-50 font-sans selection:bg-rose-500/20 transition-all duration-1000 ${isLoggingOut ? "pointer-events-none" : ""}`}
    >
      {/* Cinematic Fullscreen Logout Stage Overlay Container */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-linear-to-br from-rose-950/95 via-red-900/95 to-slate-900/98 backdrop-blur-md flex flex-col items-center justify-center z-99999 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="relative flex items-center justify-center w-40 h-40">
            {[...Array(8)].map((_, i) => (
              <Heart
                key={i}
                size={24}
                className="absolute text-rose-400 fill-rose-400 opacity-0"
                style={{
                  animation: `heartBurst 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) 0.2s infinite`,
                  transform: `rotate(${i * 45}deg) translateY(-20px)`,
                  transformOrigin: "center center",
                }}
              />
            ))}

            <div className="absolute animate-[heartDisintegrate_2s_ease-in-out_infinite] text-white">
              <svg
                className="w-20 h-20 filter drop-shadow-[0_0_25px_rgba(244,63,94,0.7)] text-rose-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          <div className="text-center mt-6 space-y-2 px-4 animate-[textSlideUp_0.6s_ease-out_0.2s_forwards] opacity-0">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Locking our love nest safely...
            </h3>
            <p className="text-rose-200/70 text-sm font-medium max-w-xs mx-auto">
              Memories synced. See you very soon, love! ❤️
            </p>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay Blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-rose-950/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Styled Thematic Sidebar Layout */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-pink-100 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:z-auto flex flex-col shadow-xl shadow-rose-950/5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-rose-50/80 bg-linear-to-b from-rose-50/30 to-transparent">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shadow-rose-500/10 group-hover:scale-105 transition-transform border border-pink-100">
              <Image
                src={Logo}
                height={26}
                width={26}
                alt="RA Logo"
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                RayHan<span className="text-rose-500 font-bold">Afrin</span>
                <Heart
                  size={12}
                  className="fill-rose-500 text-rose-500 animate-pulse inline"
                />
              </h1>
              <p className="text-[10px] font-bold mt-0.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100/60 text-rose-600 uppercase tracking-wider w-fit">
                {role === "rayhan"
                  ? "⚡ RayHan's Orbit"
                  : role === "afrin"
                    ? "✨ Afrin's Orbit"
                    : "🔒 Shared Hub"}
              </p>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 hover:bg-rose-50 text-slate-500 rounded-xl border border-transparent hover:border-pink-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Navigation Links Container */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? "bg-linear-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold border border-rose-100/70 shadow-xs"
                    : "text-slate-600 hover:bg-rose-50/40 hover:text-slate-900 border border-transparent"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-rose-500 rounded-r-full" />
                )}
                <Icon
                  size={18}
                  className={`transition-colors duration-200 ${isActive ? "text-rose-500" : "text-slate-400 group-hover:text-rose-500"}`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Anchor / Actions */}
        <div className="border-t border-rose-50 p-4 bg-linear-to-t from-rose-50/20 to-transparent">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="relative">
              <img
                src={session?.user?.image || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white ring-4 ring-rose-500/10 shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate font-medium tracking-tight">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-white bg-white border border-slate-200 hover:border-transparent hover:bg-linear-to-r hover:from-rose-500 hover:to-red-600 rounded-xl shadow-xs transition-all duration-300 cursor-pointer group active:scale-95"
          >
            <LogOut
              size={14}
              className="text-slate-400 group-hover:text-white transition-colors"
            />
            Logout
          </button>
        </div>
      </aside>

      {/* Primary Dashboard Content Panel Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full min-h-0">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-rose-50 text-slate-600 border border-slate-200/60 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-sm text-slate-800 tracking-tight flex items-center gap-1">
            RayHan💝Afrin
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-h-0 min-w-0 flex flex-col relative overflow-y-auto overflow-x-hidden">
          <AmbientHeart
            size="16px"
            left="10%"
            delay={1}
            duration={14}
            opacity="opacity-25"
          />
          <AmbientHeart
            size="24px"
            left="45%"
            delay={0}
            duration={19}
            opacity="opacity-15"
          />
          <AmbientHeart
            size="14px"
            left="75%"
            delay={3}
            duration={12}
            opacity="opacity-30"
          />
          <AmbientHeart
            size="32px"
            left="88%"
            delay={6}
            duration={22}
            opacity="opacity-10"
          />

          <div className={`flex-1 min-h-full w-full relative z-10 ${pathname?.startsWith("/dashboard/allMemories") ? "p-0" : "p-4 md:p-8"}`}>
            <div className="flex min-h-full w-full min-w-0 flex-col">
              {access.allowed ? (
                children
              ) : (
                <AccessDenied allowedRoles={access.allowedRoles} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Global CSS Animation Engine */}
      <style jsx global>{`
        @keyframes dashboardFloat {
          0% {
            transform: translateY(0) scale(0.9) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-45vh) scale(1.05) rotate(10deg);
          }
          85% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-95vh) scale(0.85) rotate(-10deg);
            opacity: 0;
          }
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.13);
          }
          40% {
            transform: scale(1.05);
          }
          60% {
            transform: scale(1.18);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes textSlideUp {
          from {
            transform: translateY(15px);
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes heartDisintegrate {
          0% {
            transform: scale(0.3);
            opacity: 0;
            filter: blur(4px);
          }
          30% {
            transform: scale(1.1);
            opacity: 1;
            filter: blur(0px);
          }
          60% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.6);
            opacity: 0;
            filter: blur(8px);
          }
        }
        @keyframes heartBurst {
          0% {
            transform: rotate(inherit) translateY(0px) scale(0.2);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          100% {
            transform: rotate(inherit) translateY(-140px) scale(1.2);
            opacity: 0;
            filter: blur(1px);
          }
        }
      `}</style>
    </div>
  );
}
