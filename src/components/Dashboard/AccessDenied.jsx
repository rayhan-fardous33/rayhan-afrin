"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Heart } from "lucide-react";

export default function AccessDenied({ allowedRoles = [] }) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
      {/* Premium Glassmorphism Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-pink-100 bg-white/70 p-8 text-center shadow-xl shadow-rose-500/10 backdrop-blur-md md:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Thematic Icon Treatment */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-rose-50 to-pink-50 shadow-inner border border-rose-100/60">
          {/* Pulsing outer ring */}
          <div className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping opacity-60" style={{ animationDuration: '3s' }} />
          
          {/* Layered icons: A lock nested inside a soft heart */}
          <Heart size={52} className="absolute text-pink-200 fill-pink-100 animate-pulse" />
          <div className="relative z-10 p-2 bg-white rounded-full shadow-sm">
            <Lock size={20} className="text-rose-500" />
          </div>
        </div>

        {/* Softened Copy */}
        <h2 className="text-2xl font-black tracking-tight text-slate-800 md:text-3xl">
          Private Sanctuary
        </h2>
        
        <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
          Oops! You've wandered into a restricted corner of our universe. This space is kept safely under lock and key.
        </p>

        {/* Thematic Roles Array Indicator */}
        {allowedRoles.length > 0 && (
          <div className="mt-6 inline-flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-white/60 border border-pink-100/80 shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              Keys Held By <Heart size={10} className="fill-rose-400" />
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-rose-50 to-pink-50 text-rose-600 border border-rose-200/60 uppercase tracking-wide shadow-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Return Action */}
        <div className="mt-8 pt-6 border-t border-rose-100/60">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md shadow-rose-500/25 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Orbit
          </Link>
        </div>
      </div>
    </div>
  );
}