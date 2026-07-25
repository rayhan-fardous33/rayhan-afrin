"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Logo from "@/assets/logo.png";

// Premium floating love component with personalized animation parameters
const FloatingHeart = ({
  size,
  left,
  delay,
  duration,
  opacity = "opacity-20",
}) => (
  <div
    className={`absolute pointer-events-none z-0 ${opacity} text-rose-500`}
    style={{
      width: size,
      height: size,
      bottom: "-10%",
      left: left,
      animation: `floatUp ${duration}s linear ${delay}s infinite`,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full drop-shadow-[0_4px_10px_rgba(244,63,94,0.3)]"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </div>
);

const LoginPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        toast.error(signInError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back, love! ❤️");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="luxury-login flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-rose-50 via-pink-100 to-rose-100 p-4">
        <div className="relative flex items-center justify-center">
          {/* Outer pulsing ripple effect */}
          <div className="absolute w-24 h-24 bg-rose-400/30 rounded-full animate-ping opacity-75" />

          {/* Inner softer glow */}
          <div className="absolute w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-pulse" />

          {/* The Beating Heart */}
          <div className="relative transform transition-transform hover:scale-110">
            <svg
              className="w-16 h-16 text-rose-500 fill-current drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)] animate-[heartbeat_1.2s_infinite_ease-in-out]"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* Cute loading text */}
        <h2 className="mt-8 text-sm font-semibold tracking-widest text-rose-600/80 uppercase animate-pulse text-center">
          Loading our universe...
        </h2>
        <style jsx global>{`
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
        `}</style>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return (
    <div className="luxury-login relative min-h-screen flex flex-col justify-between items-center bg-linear-to-tr from-rose-100 via-pink-50 to-red-50 overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Floating Love Hearts (Staggered Placements) */}
      <FloatingHeart
        size="24px"
        left="5%"
        delay={0}
        duration={12}
        opacity="opacity-30"
      />
      <FloatingHeart
        size="40px"
        left="15%"
        delay={3}
        duration={18}
        opacity="opacity-20"
      />
      <FloatingHeart
        size="18px"
        left="40%"
        delay={1}
        duration={14}
        opacity="opacity-40"
      />
      <FloatingHeart
        size="32px"
        left="65%"
        delay={5}
        duration={16}
        opacity="opacity-25"
      />
      <FloatingHeart
        size="50px"
        left="80%"
        delay={2}
        duration={22}
        opacity="opacity-15"
      />
      <FloatingHeart
        size="28px"
        left="92%"
        delay={7}
        duration={13}
        opacity="opacity-35"
      />

      {/* Main Container */}
      <div className="w-full flex-1 flex items-center justify-center z-10 my-auto">
        <div className="w-full max-w-5xl bg-white/70 backdrop-blur-2xl border border-pink-200/60 rounded-[2.5rem] shadow-2xl shadow-rose-900/5 grid md:grid-cols-12 overflow-hidden transition-all duration-500 hover:shadow-rose-900/10">
          {/* Left: Beautiful Couple Side Panel */}
          <div
            className="hidden md:flex md:col-span-5 flex-col justify-center items-center p-8 lg:p-12 relative bg-cover bg-center bg-no-repeat min-h-137.5"
            style={{
              backgroundImage: `url('https://i.ibb.co.com/zTvkYHzH/1000085588.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-rose-950/40 z-0" />
            <div className="absolute inset-0 bg-linear-to-br from-rose-1000/50 via-transparent to-red-950/60 z-0" />

            <div className="relative z-10 text-center space-y-6">
              <div></div><br/><br/><br/><br/><br/><br/>
              <div className="space-y-2">
                <h1 className="font-extrabold text-3xl tracking-tight text-white drop-shadow-md">
                  RayHan<span className="text-rose-600">Afrin</span>
                </h1>
                <div className="w-12 h-0.5 bg-rose-400 mx-auto rounded-full opacity-80" />
                <p className="text-rose-100/90 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                  Two hearts, one synchronized universe.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Modern Couple Core Login Form */}
          <div className="md:col-span-7 p-6 sm:p-10 md:p-8 lg:p-14 flex flex-col justify-center bg-white/90">
            <div className="space-y-6 max-w-md w-full mx-auto">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 md:hidden mb-4 bg-rose-50 w-fit px-3 py-1.5 rounded-full border border-rose-100">
                  <Image src={Logo} height={24} width={24} alt="Logo" />
                  <span className="font-bold text-sm text-slate-800">
                    RayHan<span className="text-rose-600">Afrin</span>
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Welcome Back, Love{" "}
                  <Heart
                    size={20}
                    className="fill-rose-500 text-rose-500 animate-pulse"
                  />
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Please sign in to access our private shared dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ourstory@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Session Toggle */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 bg-slate-50 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-500"
                    />
                    <span className="group-hover:text-rose-600 transition-colors">
                      Keep our connection alive
                    </span>
                  </label>
                </div>

                {/* Inline Errors */}
                {error && (
                  <div className="p-3 text-xs bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-center font-medium animate-shake">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium py-3 rounded-xl shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 transition-all disabled:opacity-50 text-sm group cursor-pointer"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <>
                      Enter Our Universe
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-pink-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/90 rounded-full text-slate-400 font-medium text-[11px]">
                    Secure Bond Verification
                  </span>
                </div>
              </div>

              {/* OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-rose-50/40 hover:border-rose-200 transition text-sm font-medium shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Verify with Google
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Page Footer */}
      <div className="w-full text-center text-[10px] text-rose-400/70 mt-6 pointer-events-none opacity-80 tracking-widest uppercase font-medium">
        Encrypted Love Nest Endpoint
      </div>

      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          50% {
            transform: translateY(-50vh) translateX(15px) scale(1.1)
              rotate(15deg);
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-110vh) translateX(-10px) scale(0.9)
              rotate(-15deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
