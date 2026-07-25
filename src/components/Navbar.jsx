"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  SquareUser,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { useLogout } from "@/providers/LogoutProvider";

const NAV_LINKS = [
  { label: "Home", mobileLabel: "Home", target: "banner" },
  { label: "Story", mobileLabel: "Our Story", target: "story" },
  { label: "Memories", mobileLabel: "Memories", target: "memories" },
  { label: "Fun Activity", mobileLabel: "Fun Activity", href: "/activities" },
];

const springTransition = {
  type: "spring",
  bounce: 0.18,
  duration: 0.65,
};

export default function Navbar({
  partner1 = "RayHan",
  partner2 = "Afrin",
  anniversaryDate = "2026-01-14T14:18:00",
}) {
  const [daysTogether, setDaysTogether] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("banner");
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const { triggerLogout } = useLogout();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const user = session?.user;

  const entranceAnimation = shouldReduceMotion
    ? { initial: false, animate: { opacity: 1 } }
    : { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 } };

  const floatingHearts = useMemo(
    () => [
      { left: "10%", delay: 0, duration: 8 },
      { left: "50%", delay: 1.6, duration: 10 },
      { left: "84%", delay: 0.8, duration: 9 },
    ],
    []
  );

  useEffect(() => {
    const calculateDays = () => {
      const anniversary = new Date(anniversaryDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - anniversary.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };

    calculateDays();
    const interval = window.setInterval(calculateDays, 60000);
    return () => window.clearInterval(interval);
  }, [anniversaryDate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPosition = window.scrollY + 120;

      for (const section of NAV_LINKS) {
        if (!section.target) continue;
        const el = document.getElementById(section.target);
        if (!el) continue;

        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(section.target);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);

    const element = document.getElementById(id);
    if (!element) return;

    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const offsetPosition = elementRect - bodyRect - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const handleNavigation = (link) => {
    if (link.href) {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      router.push(link.href);
      return;
    }

    if (pathname !== "/") {
      router.push(`/#${link.target}`);
      return;
    }

    handleScrollTo(link.target);
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    triggerLogout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center p-4 pointer-events-none md:p-6">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(193,18,31,0.24),transparent_58%)] md:hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_34%,rgba(231,185,138,0.12),transparent_24%),radial-gradient(circle_at_78%_10%,rgba(122,0,21,0.32),transparent_32%)]" />
        {!shouldReduceMotion &&
          floatingHearts.map((heart) => (
            <motion.div
              key={heart.left}
              className="absolute top-24 text-[#E7B98A]/15 blur-[0.5px]"
              style={{ left: heart.left }}
              animate={{ y: [-4, -34, -4], opacity: [0, 0.38, 0] }}
              transition={{
                repeat: Infinity,
                duration: heart.duration,
                delay: heart.delay,
                ease: "easeInOut",
              }}
            >
              <Heart size={14} fill="currentColor" />
            </motion.div>
          ))}
      </div>

      <motion.div
        {...entranceAnimation}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`
          pointer-events-auto w-full max-w-7xl overflow-visible
          rounded-[28px] border border-white/[0.08]
          bg-[rgba(20,20,20,0.75)] shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)]
          backdrop-blur-[20px] transition-all duration-500 ease-out
          md:rounded-full
          ${scrolled ? "border-[#E7B98A]/15 bg-[#111111]/80 shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_46px_rgba(193,18,31,0.22)]" : ""}
        `}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-7">
          <button
            type="button"
            onClick={() => handleNavigation(NAV_LINKS[0])}
            className="group flex min-w-0 items-center gap-3 rounded-full outline-none transition-transform duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Go to home section"
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center">
              <span className="absolute inset-0 rounded-full bg-[#C1121F]/35 blur-xl transition duration-300 group-hover:bg-[#C1121F]/55" />
              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[linear-gradient(135deg,#640D14,#C1121F)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_28px_rgba(193,18,31,0.32)]">
                <Heart
                  size={18}
                  fill="white"
                  className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                />
              </span>
            </span>

            <span className="min-w-0 text-left">
              <span className="block font-playfair text-lg font-bold leading-tight tracking-normal text-white sm:hidden">
                R<span className="text-[#E7B98A]">&amp;</span>A
              </span>
              <span className="hidden truncate font-playfair text-lg font-bold leading-tight tracking-normal text-white sm:block md:text-xl">
                {partner1} <span className="text-[#E7B98A]">&</span> {partner2}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase leading-none tracking-[0.16em] text-[#D4AF37] sm:hidden">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C1121F] shadow-[0_0_8px_rgba(193,18,31,0.95)]" />
                </span>
                {daysTogether} days
              </span>
              <span className="hidden text-[9px] font-semibold uppercase leading-none tracking-[0.28em] text-[#D4AF37] sm:block">
                Luxury Scrapbook
              </span>
            </span>
          </button>

          {/* Desktop Navigation Link Loop */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Desktop navigation">
            {NAV_LINKS.map((link) => {
              const isActive = link.href ? pathname === link.href : pathname === "/" && activeSection === link.target;
              return (
                <button
                  key={link.target}
                  type="button"
                  onClick={() => handleNavigation(link)}
                  className={`
                    relative rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em]
                    outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70
                    ${isActive ? "text-white" : "text-[#B5B5B5] hover:bg-white/[0.04] hover:text-white"}
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-0 rounded-full border border-[#E7B98A]/15 bg-[linear-gradient(135deg,rgba(100,13,20,0.72),rgba(193,18,31,0.28))] shadow-[0_0_24px_rgba(193,18,31,0.18)]"
                      transition={springTransition}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden items-center rounded-full border border-white/[0.08] bg-black/30 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:flex">
              <span className="relative mr-3 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C1121F] shadow-[0_0_12px_rgba(193,18,31,0.95)]" />
              </span>
              <span className="flex flex-col">
                <span className="mb-1 text-[8px] font-semibold uppercase leading-none tracking-[0.24em] text-[#D4AF37]">
                  Days Together
                </span>
                <span className="text-xs font-bold leading-none text-white">{daysTogether}</span>
              </span>
            </div>

            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_28px_rgba(193,18,31,0.2)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
              >
                <LogIn size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((value) => !value)}
                  className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/30 p-1 pr-3 outline-none transition-all duration-300 hover:border-[#E7B98A]/35 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                >
                  <img
                    src={user?.image || "/default-avatar.png"}
                    className="h-8 w-8 rounded-full border border-white/15 object-cover"
                    alt={user?.name ? `${user.name} profile` : "User profile"}
                  />
                  <ChevronDown
                    size={14}
                    className={`text-[#B5B5B5] transition-transform duration-300 group-hover:text-[#E7B98A] ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute right-0 z-[110] mt-4 w-64 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#171717]/95 shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_36px_rgba(193,18,31,0.16)] backdrop-blur-2xl"
                      role="menu"
                    >
                      <div className="border-b border-white/[0.06] bg-[radial-gradient(circle_at_20%_0%,rgba(193,18,31,0.2),transparent_52%)] p-4">
                        <p className="truncate font-playfair text-lg font-bold text-white">
                          {user?.name || "User"}
                        </p>
                        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[#B5B5B5] outline-none transition-all duration-300 hover:bg-[#C1121F]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard size={18} className="transition-colors duration-300 group-hover:text-[#E7B98A]" />
                          Dashboard
                        </Link>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogoutClick}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#ff6f7d] outline-none transition-all duration-300 hover:bg-[#C1121F]/10 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-black/30 text-white outline-none transition-all duration-300 hover:border-[#E7B98A]/30 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden rounded-b-[28px] border-t border-white/[0.08] bg-[#050505]/95 lg:hidden"
            >
              <nav className="space-y-2 p-5" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href ? pathname === link.href : pathname === "/" && activeSection === link.target;

                  return (
                    <button
                      key={link.target}
                      type="button"
                      onClick={() => handleNavigation(link)}
                      className={`
                        flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left text-sm font-bold uppercase tracking-[0.16em]
                        outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70
                        ${isActive
                          ? "border border-[#C1121F]/25 bg-[#C1121F]/10 text-white shadow-[0_0_24px_rgba(193,18,31,0.14)]"
                          : "text-[#B5B5B5] hover:bg-white/[0.05] hover:text-white"}
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.mobileLabel}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C1121F] shadow-[0_0_12px_#C1121F]" />
                      )}
                    </button>
                  );
                })}

                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="w-full rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                    >
                      Login
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 font-bold text-white outline-none transition-all duration-300 hover:border-[#E7B98A]/25 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SquareUser className="text-[#D4AF37]" />
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#C1121F]/25 bg-[#7A0015]/20 py-4 font-bold uppercase tracking-[0.12em] text-[#ff6f7d] outline-none transition-all duration-300 hover:bg-[#C1121F]/15 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
