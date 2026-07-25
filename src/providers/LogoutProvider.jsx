"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

// 1. Create the context
const LogoutContext = createContext();

// 2. Custom hook for easy access
export const useLogout = () => useContext(LogoutContext);

export function LogoutProvider({ children }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const triggerLogout = async () => {
    setIsLoggingOut(true);

    // Allow the 2.2-second heart particle burst and contraction animation to fully complete
    setTimeout(async () => {
      const { authClient } = await import("@/lib/auth-client");
      await authClient.signOut();

      setIsLoggingOut(false);
      router.push("/");
    }, 3000);
  };

  return (
    <LogoutContext.Provider value={{ triggerLogout }}>
      {/* Wrapper to shrink the whole page down slightly when logging out */}
      <div
        className={`transition-all duration-1000 min-h-screen ${
          isLoggingOut ? "scale-[0.99] overflow-hidden pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Cinematic Fullscreen Logout Stage Overlay Container */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-linear-to-br from-rose-950/95 via-red-900/95 to-slate-900/98 backdrop-blur-md flex flex-col items-center justify-center z-99999 animate-[fadeIn_0.5s_ease-out_forwards]">
          {/* Radial explosion particle ring setup */}
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Burst Hearts radiating outwards using variable custom angle/delay properties */}
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

            {/* Pulsing Core Dynamic Signature Matrix Heart */}
            <div className="absolute animate-[heartDisintegrate_2s_ease-in-out_infinite] text-white">
              <svg
                className="w-20 h-20 filter drop-shadow-[0_0_25px_rgba(244,63,94,0.7)] text-rose-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          {/* Emotional exit text microcopy */}
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

      {/* Global CSS Animation Engine included directly in the provider */}
      <style jsx global>{`
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
            transform: translateY(0);
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
    </LogoutContext.Provider>
  );
}
