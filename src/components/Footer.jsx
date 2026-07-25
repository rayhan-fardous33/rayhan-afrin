"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CUTE_QUOTES = [
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine. — Maya Angelou",
  "If I know what love is, it is because of you. — Hermann Hesse",
  "We were together. I forget the rest. — Walt Whitman",
  "I love you not only for what you are, but for what I am when I am with you. — Elizabeth Barrett Browning",
  "You are my today and all of my tomorrows. — Leo Christopher",
  "To be your friend was all I ever wanted; to be your lover was all I ever dreamed. — Valerie Lombardo",
  "Grow old along with me! The best is yet to be. — Robert Browning"
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

  useEffect(() => {
    const savedHugs = localStorage.getItem('couple_virtual_hugs');
    if (savedHugs) {
      setHugCount(parseInt(savedHugs, 10));
    } else {
      // Starting default cozy hugs count
      setHugCount(88);
    }
  }, []);

  const handleSendHug = () => {
    setIsHugAnimating(true);
    const nextHugs = hugCount + 1;
    setHugCount(nextHugs);
    localStorage.setItem('couple_virtual_hugs', nextHugs.toString());
    
    setTimeout(() => {
      setIsHugAnimating(false);
    }, 1000);
  };

  const cycleQuote = () => {
    setQuoteIndex((prevIndex) => (prevIndex + 1) % CUTE_QUOTES.length);
  };

  return (
    <footer className="luxury-footer relative bg-slate-950 text-slate-400 overflow-hidden border-t border-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Interactive Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-900 items-center">
          
          {/* Left Column: Interactive Hug Box */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            <h3 className="font-serif text-xl font-bold text-white flex items-center justify-center lg:justify-start gap-2">
              <span>🤗</span> Send a Virtual Hug!
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto lg:mx-0 leading-relaxed">
              Are you missing them right now? Give this button a tap to send a real-time appreciation squeeze!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleSendHug}
                className="relative px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-rose-900/30 flex items-center gap-2 group transform active:scale-95"
              >
                <span>Squeeze Me</span>
                <span className={`inline-block ${isHugAnimating ? 'animate-bounce text-base' : 'group-hover:scale-110'}`}>
                  ❤️
                </span>
                
                {/* Floating Heart Effect */}
                {isHugAnimating && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-ping select-none pointer-events-none text-rose-400">
                    💖
                  </span>
                )}
              </button>
              
              <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Total Squeezes: <strong className="text-white font-extrabold">{hugCount}</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Love Quote Generator */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900 p-6 sm:p-8 rounded-3xl relative text-center lg:text-left">
            <div className="absolute top-4 right-4 text-slate-800 text-6xl font-serif select-none pointer-events-none">
              “
            </div>
            
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-rose-500 tracking-widest uppercase block">
                Words of Affection
              </span>
              <p className="font-serif italic text-sm sm:text-base leading-relaxed text-slate-200 min-h-15 flex items-center justify-center lg:justify-start">
                "{CUTE_QUOTES[quoteIndex]}"
              </p>
              
              <button
                onClick={cycleQuote}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center justify-center lg:justify-start gap-1.5 mx-auto lg:mx-0 group"
              >
                <span>Cycle Quote</span>
                <span className="group-hover:rotate-45 transition-transform">🔄</span>
              </button>
            </div>
          </div>

        </div>

        {/* Middle Row: Links and Branding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 text-center md:text-left">
          
          {/* Col 1: Branding & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="text-2xl animate-pulse">❤️</span>
              <span className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                {partner1} & {partner2}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
              This is our little home on the internet. A shared diary made to capture the big travels, lazy Sundays, sticky note reminders, and beautiful growth.
            </p>
          </div>

          {/* Col 2: Navigation Map */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">
              Digital Map
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold max-w-xs mx-auto md:mx-0">
              <Link href="/#banner" className="hover:text-rose-400 text-left transition-colors">Home</Link>
              <Link href="/#story" className="hover:text-rose-400 text-left transition-colors">Our Story</Link>
              <Link href="/#memories" className="hover:text-rose-400 text-left transition-colors">Memories</Link>
              <Link href="/activities" className="hover:text-rose-400 text-left transition-colors">Fun Activities</Link>
              <Link href="/activities#favorites" className="hover:text-rose-400 text-left transition-colors">Favorites</Link>
              <Link href="/activities#bucketlist" className="hover:text-rose-400 text-left transition-colors">Bucket List</Link>
              <Link href="/activities#quiz" className="hover:text-rose-400 text-left transition-colors">Trivia Quiz</Link>
              <Link href="/activities#notes" className="hover:text-rose-400 text-left transition-colors">Love Notes</Link>
              <Link href="/activities#coupons" className="hover:text-rose-400 text-left transition-colors">Love Coupons</Link>
              <Link href="/activities#future" className="hover:text-rose-400 text-left transition-colors">Future Letters</Link>
              <Link href="/activities#dialogue" className="hover:text-rose-400 text-left transition-colors">Daily Dialogue</Link>
              <Link href="/activities#decider" className="hover:text-rose-400 text-left transition-colors">Date Decider</Link>
            </div>
          </div>

          {/* Col 3: Safe Spaces / Playlist Sync */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest">
              Our Safe Spaces
            </h4>
            
            <div className="flex flex-col gap-2.5 max-w-xs mx-auto md:mx-0 text-xs">
              <a 
                href={hisInstagram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-900 hover:border-slate-800 transition-all text-slate-300 hover:text-white flex items-center justify-between font-bold"
              >
                <span>🙋‍♂️ {partner1}'s Instagram</span>
                <span className="text-xs">📸</span>
              </a>
              <a 
                href={herInstagram}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-900 hover:border-slate-800 transition-all text-slate-300 hover:text-white flex items-center justify-between font-bold"
              >
                <span>🙋‍♀️ {partner2}'s Instagram</span>
                <span className="text-xs">📸</span>
              </a>
              <a 
                href={spotifyPlaylistUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-900 hover:border-slate-800 transition-all text-slate-300 hover:text-white flex items-center justify-between font-bold"
              >
                <span>🎵 Our Shared Playlist</span>
                <span className="text-xs">🎧</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Row: Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {partner1} & {partner2}. Built with infinite love.
          </p>
          
          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <span>Designed with React & Next.js</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
