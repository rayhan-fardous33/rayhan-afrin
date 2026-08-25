"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  RefreshCw,
  Music,
  Compass,
} from "lucide-react";

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ROMANTIC_QUOTES = [
  {
    quote: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    author: "Maya Angelou"
  },
  {
    quote: "If I know what love is, it is because of you.",
    author: "Hermann Hesse"
  },
  {
    quote: "We were together. I forget the rest.",
    author: "Walt Whitman"
  },
  {
    quote: "I love you not only for what you are, but for what I am when I am with you.",
    author: "Elizabeth Barrett Browning"
  },
  {
    quote: "You are my today and all of my tomorrows.",
    author: "Leo Christopher"
  },
  {
    quote: "Whatever our souls are made of, yours and mine are the same.",
    author: "Emily Brontë"
  },
  {
    quote: "Grow old along with me! The best is yet to be.",
    author: "Robert Browning"
  }
];

export default function Footer({
  partner1 = "RayHan",
  partner2 = "Afrin",
  spotifyPlaylistUrl = "#",
  hisInstagram = "#",
  herInstagram = "#"
}) {
  const [hugCount, setHugCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHugAnimating, setIsHugAnimating] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    const savedHugs = localStorage.getItem("couple_virtual_hugs");
    if (savedHugs) {
      setHugCount(parseInt(savedHugs, 10));
    } else {
      setHugCount(99);
    }
  }, []);

  const handleSendHug = () => {
    setIsHugAnimating(true);
    const nextHugs = hugCount + 1;
    setHugCount(nextHugs);
    localStorage.setItem("couple_virtual_hugs", nextHugs.toString());

    // Generate floating heart particles
    const id = Date.now();
    const randomOffset = Math.floor(Math.random() * 60) - 30; // -30px to +30px
    setFloatingHearts((prev) => [...prev, { id, offset: randomOffset }]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1200);

    setTimeout(() => {
      setIsHugAnimating(false);
    }, 400);
  };

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
  };

  return (
    <footer className="relative bg-[#050505] text-slate-300 overflow-hidden border-t border-rose-900/20 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Soft Romantic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-rose-950/20 via-rose-900/5 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute -top-24 left-1/4 w-72 h-72 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Top Feature Grid: Romantic Branding + Virtual Hug + Quote Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Branding & Virtual Hug Interactive Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-rose-950/20 via-slate-900/40 to-slate-950/60 border border-rose-900/20 p-6 sm:p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group">
            
            {/* Subtle glow accent inside card */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500" />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center p-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </span>
                <span className="text-xs font-semibold text-rose-300 tracking-wider uppercase">
                  Forever & Always
                </span>
              </div>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{partner1}</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse inline-block" />
                <span>{partner2}</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                Our digital sanctuary of love, laughter, cherished memories, and endless romantic adventures.
              </p>
            </div>

            {/* Hug Interactive Section */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div className="relative">
                <button
                  onClick={handleSendHug}
                  className={`relative px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-lg shadow-rose-900/30 hover:shadow-rose-700/50 flex items-center gap-2 transform active:scale-95 ${
                    isHugAnimating ? "scale-95" : ""
                  }`}
                >
                  <Heart className={`w-4 h-4 fill-white transition-transform ${isHugAnimating ? "scale-125" : ""}`} />
                  <span>Send a Virtual Squeeze</span>

                  {/* Floating Heart Particles */}
                  {floatingHearts.map((heart) => (
                    <span
                      key={heart.id}
                      style={{ transform: `translateX(${heart.offset}px)` }}
                      className="absolute -top-8 left-1/2 text-rose-300 text-lg animate-bounce select-none pointer-events-none"
                    >
                      💖
                    </span>
                  ))}
                </button>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Total Hugs:</span>
                <strong className="text-rose-300 font-semibold">{hugCount}</strong>
              </div>
            </div>

          </div>

          {/* Right Column: Love Quote Card */}
          <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400/90 tracking-widest uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-400/40 text-rose-400" />
                Words of Affection
              </span>
              <button
                onClick={cycleQuote}
                title="Next Love Quote"
                className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-300 transition-colors border border-slate-700/50 group"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            <div className="space-y-3 my-auto py-2">
              <p className="font-serif italic text-base sm:text-lg text-slate-100 leading-relaxed font-light">
                &ldquo;{ROMANTIC_QUOTES[quoteIndex].quote}&rdquo;
              </p>
              <p className="text-xs text-rose-300/80 font-medium tracking-wide text-right">
                — {ROMANTIC_QUOTES[quoteIndex].author}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/50">
              <span>Updated automatically or tap to cycle</span>
              <span className="text-rose-400/60">Quote {quoteIndex + 1} of {ROMANTIC_QUOTES.length}</span>
            </div>
          </div>

        </div>

        {/* Middle Navigation & Safe Spaces Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          
          {/* Left: Navigation Shortcuts (8 Cols) */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              <span>Explore Our Space</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs font-medium">
              <Link href="/#banner" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Home
              </Link>
              <Link href="/#story" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Our Story
              </Link>
              <Link href="/#memories" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Memories
              </Link>
              <Link href="/activities" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Fun Activities
              </Link>
              <Link href="/activities#favorites" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Our Favorites
              </Link>
              <Link href="/activities#bucketlist" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Bucket List
              </Link>
              <Link href="/activities#notes" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Love Notes
              </Link>
              <Link href="/activities#coupons" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Love Coupons
              </Link>
              <Link href="/activities#decider" className="hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-500/60" /> Date Decider
              </Link>
            </div>
          </div>

          {/* Right: Safe Spaces / Playlist (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Connect & Listen</span>
            </h3>

            <div className="space-y-2 text-xs font-medium">
              <a
                href={spotifyPlaylistUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-900/30 transition-all flex items-center justify-between text-slate-200 hover:text-white group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Music className="w-4 h-4" />
                  </div>
                  <span>Shared Playlist</span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-rose-400 transition-colors">Listen &rarr;</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={hisInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-900/30 transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white group"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span>{partner1}</span>
                </a>
                <a
                  href={herInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-900/30 transition-all flex items-center justify-center gap-2 text-slate-300 hover:text-white group"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>{partner2}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Soft Heart Signature */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
          <p className="font-normal">
            &copy; {new Date().getFullYear()} <strong className="text-slate-400 font-medium">{partner1} & {partner2}</strong>. Crafted with infinite love.
          </p>

          <div className="flex items-center gap-1.5 text-slate-400 font-serif italic">
            <span>Written in the stars</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/80 animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
}
