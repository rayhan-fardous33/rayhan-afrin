"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Card } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Music, Pencil, Sparkles, X } from "lucide-react";

const counterItems = [
  { key: "years", label: "Yrs" },
  { key: "months", label: "Mths" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs", pad: true },
  { key: "minutes", label: "Mins", pad: true },
  { key: "seconds", label: "Secs", pad: true, highlight: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/**
 * HeroBanner Component for a Couple's Website.
 * @param {string} partner1 - First partner's name
 * @param {string} partner2 - Second partner's name
 * @param {string} anniversaryDate - Date format "YYYY-MM-DD" or ISO string
 * @param {string} nextAdventure - Your next planned trip or date
 * @param {string} ourSong - Name/Artist of your current favorite shared song
 * @param {function} onExploreClick - Callback when clicking main CTA
 * @param {function} onWriteClick - Callback when clicking secondary CTA
 */
export default function HeroBanner({
  partner1 = "RayHan",
  partner2 = "Afrin",
  anniversaryDate = "2026-01-14T14:18:00",
  nextAdventure = "Weekend Cabin Getaway",
  ourSong = "Lover - Taylor Swift",
  onExploreClick = () => {},
  onWriteClick = () => {},
}) {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [selectedProfile, setSelectedProfile] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const ambientHearts = useMemo(
    () => [
      { top: "14%", left: "8%", size: 18, delay: 0, duration: 8 },
      { top: "26%", left: "86%", size: 14, delay: 1.2, duration: 9 },
      { top: "78%", left: "13%", size: 12, delay: 0.6, duration: 10 },
      { top: "72%", left: "82%", size: 20, delay: 1.8, duration: 11 },
    ],
    []
  );

  useEffect(() => {
    const calculateTime = () => {
      const anniversary = new Date(anniversaryDate);
      const now = new Date();
      let diff = Math.abs(now.getTime() - anniversary.getTime());

      const msPerSecond = 1000;
      const msPerMinute = msPerSecond * 60;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;

      const days = Math.floor(diff / msPerDay);
      diff -= days * msPerDay;

      const hours = Math.floor(diff / msPerHour);
      diff -= hours * msPerHour;

      const minutes = Math.floor(diff / msPerMinute);
      diff -= minutes * msPerMinute;

      const seconds = Math.floor(diff / msPerSecond);
      const years = Math.floor(days / 365);
      const remainingDaysAfterYears = days % 365;
      const months = Math.floor(remainingDaysAfterYears / 30);
      const remainingDays = remainingDaysAfterYears % 30;

      setTimeTogether({
        years,
        months,
        days: remainingDays,
        hours,
        minutes,
        seconds,
      });
    };

    calculateTime();
    const interval = window.setInterval(calculateTime, 1000);
    return () => window.clearInterval(interval);
  }, [anniversaryDate]);

  useEffect(() => {
    if (!selectedProfile) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProfile(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProfile]);

  return (
    <section
      id="banner"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#050505] px-4 pb-20 pt-28 text-white sm:pt-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(193,18,31,0.26),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(231,185,138,0.12),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(122,0,21,0.32),transparent_36%),linear-gradient(180deg,#050505_0%,#090505_48%,#050505_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.82)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7B98A]/35 to-transparent" />

      {!shouldReduceMotion &&
        ambientHearts.map((heart) => (
          <motion.div
            key={`${heart.top}-${heart.left}`}
            aria-hidden="true"
            className="absolute text-[#E7B98A]/10 blur-[0.4px]"
            style={{ top: heart.top, left: heart.left }}
            animate={{ y: [-8, -34, -8], opacity: [0.08, 0.28, 0.08] }}
            transition={{
              repeat: Infinity,
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeInOut",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="visible"
        transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.12 }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12"
      >
        <div className="space-y-7 text-center lg:col-span-7 lg:text-left">
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111111]/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E7B98A] shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-[20px]"
          >
            <Sparkles size={14} />
            Our Little Corner of the Internet
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-playfair text-4xl font-bold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl"
          >
            Loving You is <br />
            <span className="bg-[linear-gradient(180deg,#ffb4b4,#ff4d6d,#b3002d)] bg-clip-text font-normal italic text-transparent drop-shadow-[0_0_34px_rgba(193,18,31,0.28)]">
              My Favorite Adventure
            </span>
          </motion.h1>
          
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-[#B5B5B5] sm:text-base md:text-lg lg:mx-0"
          >
            Welcome to the digital journal of <strong className="font-semibold text-white">{partner1}</strong> &{" "}
            <strong className="font-semibold text-white">{partner2}</strong>. This is where we archive our sweet memories,
            plan our dream bucket list, and share secret notes with each other.
          </motion.p>

          <motion.div
            variants={fadeUp}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-lg rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)] backdrop-blur-[20px] transition-all duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_50px_rgba(193,18,31,0.22)] sm:p-6 lg:mx-0"
          >
            <h3 className="mb-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37] lg:justify-start">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C1121F] shadow-[0_0_12px_rgba(193,18,31,0.95)]" />
              </span>
              Time We've Spent Together
            </h3>
            <div className="grid grid-cols-6 text-center">
              {counterItems.map((item, index) => {
                const value = item.pad
                  ? String(timeTogether[item.key]).padStart(2, "0")
                  : timeTogether[item.key];

                return (
                  <div key={item.key} className={index === 0 ? "px-1" : "border-l border-white/[0.08] px-1"}>
                    <span
                      className={`block text-xl font-extrabold tabular-nums sm:text-3xl ${
                        item.highlight
                          ? "text-[#ff4d6d] drop-shadow-[0_0_18px_rgba(193,18,31,0.55)] motion-safe:animate-pulse"
                          : "text-white"
                      }`}
                    >
                      {value}
                    </span>
                    <span className={`text-[10px] font-bold uppercase sm:text-xs ${item.highlight ? "text-[#E7B98A]" : "text-[#B5B5B5]"}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start"
          >
            <button
              type="button"
              onClick={onExploreClick}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:w-auto"
            >
              Our Love Story
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={onWriteClick}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E7B98A]/40 bg-black/30 px-8 py-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.28)] outline-none backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/70 hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
            >
              <Pencil size={17} className="text-[#D4AF37] transition-transform duration-300 group-hover:-rotate-6" />
              Write a Sweet Note
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 flex flex-col items-center justify-center lg:col-span-5 lg:mt-0"
        >
          <div className="absolute h-full w-full max-w-sm translate-x-3 -translate-y-2 rotate-3 rounded-[28px] border border-[#E7B98A]/15 bg-[#7A0015]/20 shadow-[0_20px_50px_rgba(0,0,0,0.34)]" />

          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -6, rotate: -0.5 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-sm space-y-6 rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)] backdrop-blur-[20px]"
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111111]/80 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="absolute right-3 top-3 text-[#E7B98A]/40">
                <Heart size={18} fill="currentColor" />
              </div>
              <div className="flex items-center justify-center gap-6 pb-10 pt-6">
                <ProfileOrb
                  name={partner1}
                  avatar="/rayhan-avatar.png"
                  shouldReduceMotion={shouldReduceMotion}
                  onSelect={() => setSelectedProfile({ name: partner1, avatar: "/rayhan-avatar.png", title: "The keeper of my heart" })}
                />
                <div className="font-playfair text-2xl font-bold text-[#E7B98A]">&</div>
                <ProfileOrb
                  name={partner2}
                  avatar="/afrin-avatar.png"
                  shouldReduceMotion={shouldReduceMotion}
                  onSelect={() => setSelectedProfile({ name: partner2, avatar: "/afrin-avatar.png", title: "My sweetest sunshine" })}
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <InfoRow icon={<MapPin size={16} />} label="Next Adventure:" value={nextAdventure} />
              <InfoRow icon={<Music size={16} />} label="Our Current Song:" value={ourSong} accent />
            </div>
            
            <div className="text-center">
              <span className="font-playfair text-xs italic text-[#B5B5B5]">
                "In all the world, there is no heart for me like yours."
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <ProfileCard
        profile={selectedProfile}
        shouldReduceMotion={shouldReduceMotion}
        onClose={() => setSelectedProfile(null)}
      />
    </section>
  );
}

function ProfileOrb({ name, avatar, shouldReduceMotion, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`Open ${name}'s profile card`}
      aria-haspopup="dialog"
      whileHover={shouldReduceMotion ? undefined : { y: -7, scale: 1.08, rotate: 3 }}
      transition={{ type: "spring", stiffness: 340, damping: 18 }}
      className="group relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#E7B98A]/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111111]"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#E7B98A]/70 bg-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_16px_34px_rgba(0,0,0,0.42)] transition-shadow duration-300 group-hover:shadow-[0_0_0_4px_rgba(193,18,31,0.2),0_20px_38px_rgba(193,18,31,0.35)] sm:h-20 sm:w-20">
        <Image
          src={avatar}
          alt={`${name}'s avatar`}
          fill
          sizes="(max-width: 640px) 64px, 80px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <span
        className="absolute left-1/2 top-full mt-2 max-w-[92px] -translate-x-1/2 truncate whitespace-nowrap rounded-full border border-white/10 bg-[#050505]/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E7B98A] shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      >
        {name}
      </span>
    </motion.button>
  );
}

function ProfileCard({ profile, shouldReduceMotion, onClose }) {
  const [isTextVisible, setIsTextVisible] = useState(true);

  useEffect(() => {
    if (!profile) return undefined;

    setIsTextVisible(true);
    const timer = window.setTimeout(() => setIsTextVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, [profile]);

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-card-name"
            className="w-full max-w-sm outline-none"
          >
            <Card className="relative min-h-[440px] overflow-hidden rounded-[32px] border border-white/15 bg-[#14080d] shadow-[0_26px_90px_rgba(0,0,0,0.72),0_0_48px_rgba(193,18,31,0.3)]">
              <Image
                src={profile.avatar}
                alt=""
                fill
                sizes="(max-width: 640px) calc(100vw - 32px), 384px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_5%,rgba(5,5,5,0.08)_34%,rgba(5,5,5,0.94)_100%)]" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur-md outline-none transition hover:scale-105 hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/80"
                aria-label="Close profile card"
              >
                <X size={20} />
              </button>

              <motion.div
                animate={{ opacity: isTextVisible ? 1 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.8, ease: "easeOut" }}
                className="relative z-10"
              >
                <Card.Header className="p-6 text-white">
                  <Card.Description className="text-xs font-bold uppercase tracking-[0.25em] text-[#E7B98A]">
                    Our little love story
                  </Card.Description>
                </Card.Header>
              </motion.div>

              <motion.div
                animate={{ opacity: isTextVisible ? 1 : 0, y: isTextVisible ? 0 : 8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.8, ease: "easeOut" }}
                className="relative z-10 mt-auto"
              >
                <Card.Footer className="flex flex-col items-start gap-2 p-6 pt-20 text-white">
                  <Card.Title id="profile-card-name" className="font-playfair text-4xl font-bold text-white drop-shadow-lg">
                    {profile.name}
                  </Card.Title>
                  <Card.Description className="font-playfair text-lg italic text-[#ffd5d9]">
                    {profile.title}
                  </Card.Description>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    One half of our favorite adventure, and a thousand reasons to smile.
                  </p>
                </Card.Footer>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ icon, label, value, accent = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#B5B5B5]">
        <span className={accent ? "text-[#D4AF37]" : "text-[#E7B98A]"}>{icon}</span>
        {label}
      </span>
      <span className={`max-w-[45%] text-right text-xs font-semibold ${accent ? "text-[#E7B98A]" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
