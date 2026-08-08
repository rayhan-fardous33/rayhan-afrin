"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Shield,
  Key,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  XCircle,
  Save,
  Camera,
  Heart,
  MapPin,
  Mail,
  Calendar,
  Sparkles,
  Smartphone,
  Laptop,
  LogOut,
  Bell,
  Sliders,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Globe,
  Edit3,
  Database,
  CheckSquare,
  Square,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const INITIAL_PARTNER_DATA = {
  rayhan: {
    name: "Rayhan Fardous",
    role: "Super Admin & Orbit Controller",
    badge: "Super Admin",
    avatar: "/rayhan-avatar.png",
    email: "rayhan@orbit.com",
    birthdate: "1996-07-19",
    location: "Dhaka, Bangladesh",
    status: "Coding our universe with love & precision 💻❤️",
    loveLanguage: "Quality Time & Acts of Service ⏳",
    favoriteMemory: "Our late-night walk by the river under the glowing lanterns.",
    themeColor: "from-rose-500 to-pink-600",
  },
  afrin: {
    name: "Afrin Yesmin",
    role: "Co-Author & Orbit VIP",
    badge: "VIP Partner",
    avatar: "/afrin-avatar.png",
    email: "afrin@orbit.com",
    birthdate: "2003-10-06",
    location: "Dhaka, Bangladesh",
    status: "Craving chocolate chip cookies and stargazing... 🍪✨",
    loveLanguage: "Words of Affirmation & Gifts 💌",
    favoriteMemory: "The rainy afternoon cafe when we shared that single collapsed chocolate soufflé.",
    themeColor: "from-pink-500 to-purple-600",
  },
};

const INITIAL_SESSIONS = [
  {
    id: "sess_1",
    device: "Windows PC (Chrome 126)",
    ip: "103.145.72.10 (Dhaka, BD)",
    isCurrent: true,
    lastActive: "Active now",
    type: "desktop",
  },
  {
    id: "sess_2",
    device: "iPhone 15 Pro (Safari)",
    ip: "103.145.72.14 (Dhaka, BD)",
    isCurrent: false,
    lastActive: "2 hours ago",
    type: "mobile",
  },
];

export default function RedesignedProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Role detection: check if Afrin or Rayhan
  const rawRole = (user?.role || "").toLowerCase();
  const userEmail = (user?.email || "").toLowerCase();
  const userName = (user?.name || "").toLowerCase();

  const isAfrin =
    rawRole === "afrin" ||
    userEmail.includes("afrin") ||
    userName.includes("afrin");

  const currentKey = isAfrin ? "afrin" : "rayhan";
  const partnerKey = isAfrin ? "rayhan" : "afrin";

  const currentDefaults = INITIAL_PARTNER_DATA[currentKey];
  const partnerDefaults = INITIAL_PARTNER_DATA[partnerKey];

  // Active Tab
  const [activeTab, setActiveTab] = useState("overview");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentDefaults.name,
    email: currentDefaults.email,
    avatar: currentDefaults.avatar,
    location: currentDefaults.location,
    status: currentDefaults.status,
    loveLanguage: currentDefaults.loveLanguage,
    favoriteMemory: currentDefaults.favoriteMemory,
    birthdate: currentDefaults.birthdate,
  });

  // Partner Profile State (for the partner card)
  const [partnerData, setPartnerData] = useState(partnerDefaults);

  // Sync profile data when session or user changes
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(`orbit_profile_${currentKey}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          ...currentDefaults,
          ...parsed,
          name: user?.name || parsed.name || currentDefaults.name,
          email: user?.email || parsed.email || currentDefaults.email,
          avatar: user?.image || parsed.avatar || currentDefaults.avatar,
        });
      } else {
        setProfileData({
          name: user?.name || currentDefaults.name,
          email: user?.email || currentDefaults.email,
          avatar: user?.image || currentDefaults.avatar,
          location: currentDefaults.location,
          status: currentDefaults.status,
          loveLanguage: currentDefaults.loveLanguage,
          favoriteMemory: currentDefaults.favoriteMemory,
          birthdate: currentDefaults.birthdate,
        });
      }

      const savedPartner = localStorage.getItem(`orbit_profile_${partnerKey}`);
      if (savedPartner) {
        const parsedPartner = JSON.parse(savedPartner);
        setPartnerData({
          ...partnerDefaults,
          ...parsedPartner,
        });
      } else {
        setPartnerData(partnerDefaults);
      }
    } catch (e) {
      console.error("Error reading profile from localStorage:", e);
    }
  }, [user?.email, user?.name, user?.image, isAfrin]);

  // Google Login / First Time Password Mode
  const [isGoogleLogin, setIsGoogleLogin] = useState(true);

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginNotify, setLoginNotify] = useState(true);

  // Status & Feedback Banners
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  // Anniversary Days Calculation
  const [daysTogether, setDaysTogether] = useState(1380);

  useEffect(() => {
    const anniv = new Date("2026-01-14T14:18:00");
    const now = new Date();
    const diff = Math.ceil(Math.abs(now - anniv) / (1000 * 60 * 60 * 24));
    setDaysTogether(diff);
  }, []);

  // Password Strength Calculation
  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak 🔴", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair 🟠", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Strong 🟡", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Very Strong 🟢", color: "bg-emerald-500" };
      default:
        return { score: 15, label: "Very Weak", color: "bg-rose-400" };
    }
  };

  const strength = calculatePasswordStrength(passwordData.newPassword);

  // Password Change Handler (Saves to MongoDB via API)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!isGoogleLogin && !passwordData.currentPassword) {
      setPasswordError("Please enter your current account password.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await fetch("/api/user/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordSuccess(
        data.message ||
          "Password saved successfully! You can now log in using email and this password."
      );
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError(err.message || "Failed to save password to MongoDB.");
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordSuccess(""), 6000);
    }
  };

  // Profile Save Handler
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      localStorage.setItem(`orbit_profile_${currentKey}`, JSON.stringify(profileData));
    } catch (err) {
      console.error("Failed to save profile to localStorage:", err);
    }

    setTimeout(() => {
      setIsSavingProfile(false);
      setProfileSuccess(
        `${isAfrin ? "Afrin" : "Rayhan"}'s profile information saved successfully.`
      );
      setTimeout(() => setProfileSuccess(""), 3500);
    }, 600);
  };

  // Revoke Session Handler
  const handleRevokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Styling choices based on role
  const headerBgClass = isAfrin
    ? "from-pink-950 via-slate-900 to-purple-950 border-pink-900/40"
    : "from-rose-950 via-slate-900 to-rose-900 border-rose-900/40";

  const primaryBtnClass = isAfrin
    ? "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/20"
    : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20";

  const badgeText = isAfrin ? "Co-Author & Orbit VIP" : "Super Admin";
  const badgeIcon = isAfrin ? (
    <Sparkles size={13} className="text-pink-300" />
  ) : (
    <Shield size={13} className="text-rose-300" />
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* 1. HERO HEADER BANNER */}
      <div className={`relative overflow-hidden rounded-3xl bg-linear-to-r ${headerBgClass} text-white p-6 sm:p-10 shadow-xl border`}>
        <div className={`absolute -right-12 -top-12 w-64 h-64 ${isAfrin ? "bg-pink-500/20" : "bg-rose-500/20"} rounded-full blur-3xl pointer-events-none`} />
        <div className={`absolute right-48 -bottom-10 w-48 h-48 ${isAfrin ? "bg-purple-500/15" : "bg-pink-500/15"} rounded-full blur-2xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Avatar & Name */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20 shadow-2xl ring-4 ring-rose-500/30"
              />
              <button
                onClick={() => setActiveTab("edit")}
                className={`absolute bottom-0 right-0 p-2 ${isAfrin ? "bg-pink-500 hover:bg-pink-600" : "bg-rose-500 hover:bg-rose-600"} text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer`}
                title="Change Avatar"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isAfrin ? "bg-pink-500/30 text-pink-200 border-pink-400/30" : "bg-rose-500/30 text-rose-200 border-rose-400/30"} border rounded-full flex items-center gap-1.5 backdrop-blur-md`}>
                  {badgeIcon}
                  {badgeText}
                </span>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Session
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {profileData.name}
              </h1>
              <p className="text-xs sm:text-sm text-rose-200/80 font-medium flex items-center gap-2">
                <Mail size={14} className={isAfrin ? "text-pink-400" : "text-rose-400"} />
                {profileData.email} • {profileData.location}
              </p>
            </div>
          </div>

          {/* Right Days Together Anniversary Counter */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center min-w-[220px] shadow-inner space-y-1">
            <span className="text-[10px] font-bold text-rose-300 tracking-widest uppercase block">
              Days Together (Rayhan & Afrin)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <Heart size={24} className="fill-rose-500 text-rose-500 animate-pulse" />
              {daysTogether} Days
            </div>
            <span className="text-[11px] font-medium text-rose-200/70 block">
              Love score 100% • Synchronized Orbit
            </span>
          </div>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION BAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-pink-100 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "overview"
              ? isAfrin
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
          }`}
        >
          <User size={15} />
          Profile Overview
        </button>

        <button
          onClick={() => setActiveTab("edit")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "edit"
              ? isAfrin
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
          }`}
        >
          <Edit3 size={15} />
          Edit Personal Details
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "security"
              ? isAfrin
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
          }`}
        >
          <Key size={15} />
          Password & Security
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "preferences"
              ? isAfrin
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
              : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
          }`}
        >
          <Sliders size={15} />
          Preferences & Sessions
        </button>
      </div>

      {/* 3. TAB CONTENT PANELS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Current User's Info Card (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {isAfrin ? (
                  <Sparkles size={22} className="text-pink-500" />
                ) : (
                  <ShieldCheck size={22} className="text-rose-500" />
                )}
                {isAfrin ? "Afrin's VIP Credentials" : "Rayhan's Admin Credentials"}
              </h2>
              <button
                onClick={() => setActiveTab("edit")}
                className={`text-xs font-bold ${isAfrin ? "text-pink-600 hover:text-pink-700" : "text-rose-600 hover:text-rose-700"} flex items-center gap-1`}
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Full Account Name
                </span>
                <span className="text-xs font-bold text-slate-800">{profileData.name}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Account Email
                </span>
                <span className="text-xs font-bold text-slate-800">{profileData.email}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Location & Timezone
                </span>
                <span className="text-xs font-bold text-slate-800">{profileData.location}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Birthdate
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {profileData.birthdate}
                </span>
              </div>

              <div className={`col-span-1 sm:col-span-2 p-4.5 rounded-2xl ${isAfrin ? "bg-pink-50/50 border-pink-100" : "bg-rose-50/50 border-rose-100"} border space-y-1`}>
                <span className={`text-[10px] font-extrabold ${isAfrin ? "text-pink-600" : "text-rose-600"} uppercase tracking-wider block`}>
                  Current Orbit Status / Mood
                </span>
                <p className="text-xs font-semibold text-slate-800 italic">
                  "{profileData.status}"
                </p>
              </div>

              <div className="col-span-1 sm:col-span-2 p-4.5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-1">
                <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                  Love Language
                </span>
                <p className="text-xs font-bold text-slate-800">{profileData.loveLanguage}</p>
              </div>

              <div className="col-span-1 sm:col-span-2 p-4.5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                  Favorite Shared Memory
                </span>
                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                  "{profileData.favoriteMemory}"
                </p>
              </div>
            </div>
          </div>

          {/* Committed Partner Card (5 Columns) */}
          <div className="lg:col-span-5 bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake size={22} className={isAfrin ? "text-rose-500" : "text-pink-500"} />
                Committed Partner Profile
              </h2>
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-2xl ${isAfrin ? "bg-rose-50/40 border-rose-100" : "bg-pink-50/40 border-pink-100"} border`}>
              <img
                src={partnerData.avatar}
                alt={partnerData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {partnerData.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {partnerData.role}
                </p>
                <span className={`inline-block mt-1 text-[10px] font-extrabold ${isAfrin ? "text-rose-600 border-rose-200" : "text-pink-600 border-pink-200"} bg-white px-2 py-0.5 rounded-full border uppercase tracking-wider`}>
                  📍 {partnerData.location}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email Contact
                </span>
                <span className="font-bold text-slate-800">{partnerData.email}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Birthday
                </span>
                <span className="font-bold text-slate-800">
                  {partnerData.birthdate}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isAfrin ? "His Current Mood" : "Her Current Mood"}
                </span>
                <p className="font-semibold text-slate-800 italic">
                  "{partnerData.status}"
                </p>
              </div>

              <div className={`p-3.5 rounded-xl ${isAfrin ? "bg-rose-50/40 border-rose-100 text-rose-600" : "bg-pink-50/40 border-pink-100 text-pink-600"} border space-y-1`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  {isAfrin ? "His Favorite Shared Memory" : "Her Favorite Shared Memory"}
                </span>
                <p className="font-medium text-slate-700 italic leading-relaxed">
                  "{partnerData.favoriteMemory}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PERSONAL DETAILS */}
      {activeTab === "edit" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Edit3 size={20} className={isAfrin ? "text-pink-500" : "text-rose-500"} />
              Update Account & Profile Info
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Modify {isAfrin ? "Afrin" : "Rayhan"}'s personal credentials, status message, and love language details.
            </p>
          </div>

          {profileSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Avatar URL Input & Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Avatar Photo URL
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={profileData.avatar}
                  alt="Preview"
                  className={`w-14 h-14 rounded-full object-cover border-2 ${isAfrin ? "border-pink-200" : "border-rose-200"} shrink-0`}
                />
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className={`flex-1 px-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Birthdate
                </label>
                <input
                  type="date"
                  value={profileData.birthdate}
                  onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                  className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Current Status / Mood Message
              </label>
              <input
                type="text"
                value={profileData.status}
                onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Love Language
              </label>
              <select
                value={profileData.loveLanguage}
                onChange={(e) => setProfileData({ ...profileData, loveLanguage: e.target.value })}
                className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"}`}
              >
                <option value="Words of Affirmation & Gifts 💌">Words of Affirmation & Gifts 💌</option>
                <option value="Quality Time & Acts of Service ⏳">Quality Time & Acts of Service ⏳</option>
                <option value="Physical Touch & Quality Time 🤝">Physical Touch & Quality Time 🤝</option>
                <option value="Acts of Service & Physical Touch 🛠️">Acts of Service & Physical Touch 🛠️</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Favorite Shared Memory
              </label>
              <textarea
                value={profileData.favoriteMemory}
                onChange={(e) => setProfileData({ ...profileData, favoriteMemory: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"} leading-relaxed resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className={`px-6 py-3 ${isAfrin ? "bg-pink-600 hover:bg-pink-700" : "bg-rose-500 hover:bg-rose-600"} text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer`}
            >
              {isSavingProfile ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={15} />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PASSWORD & SECURITY */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Password Change Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Key size={20} className={isAfrin ? "text-pink-500" : "text-rose-500"} />
                Update Account Password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Set or update {isAfrin ? "Afrin" : "Rayhan"}'s password. Saved directly to MongoDB for email login.
              </p>
            </div>

            {/* Google Login / First Time Password Mode Banner & Checkbox */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50/60 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsGoogleLogin(!isGoogleLogin)}>
                <div className="flex items-center gap-2.5">
                  {isGoogleLogin ? (
                    <CheckSquare size={18} className="text-blue-600 shrink-0" />
                  ) : (
                    <Square size={18} className="text-slate-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      First time setting password / Signed in with Google
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Current password is not required when setting a password for Google accounts.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-700 rounded-full shrink-0">
                  Google Auth
                </span>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <Database size={16} className="text-emerald-600 shrink-0" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Current Password (ONLY required if NOT Google Login) */}
              {!isGoogleLogin && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="••••••••••••"
                      className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"} pr-10`}
                      required={!isGoogleLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    New Password
                  </label>
                  {isGoogleLogin && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ No current password required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="Enter strong new password for email login"
                    className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {passwordData.newPassword && (
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Password Strength:</span>
                      <span className="text-slate-800">{strength.label}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-500`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="Re-enter new password"
                    className={`w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 ${isAfrin ? "focus:ring-pink-500/20 focus:border-pink-500" : "focus:ring-rose-500/20 focus:border-rose-500"} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Match indicator */}
                {passwordData.confirmPassword && (
                  <p className="text-[11px] font-bold pt-1">
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Passwords match perfectly
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle size={13} /> Passwords do not match
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className={`w-full py-3.5 ${isAfrin ? "bg-linear-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-700" : "bg-linear-to-r from-rose-500 via-pink-600 to-red-600 hover:from-rose-600 hover:to-red-700"} text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
              >
                {isUpdatingPassword ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Database size={15} />
                    Save Password to MongoDB
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Checklist & 2FA Control (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 2FA & Multi-Factor Card */}
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className={isAfrin ? "text-pink-500" : "text-rose-500"} />
                Multi-Factor Authentication
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Two-Factor Auth (2FA)</p>
                  <p className="text-[10px] text-slate-400">Require OTP code at login</p>
                </div>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    twoFactor
                      ? isAfrin ? "bg-pink-500 justify-end" : "bg-rose-500 justify-end"
                      : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
                </button>
              </div>

              <div className={`p-4 rounded-2xl ${isAfrin ? "bg-pink-50/40 border-pink-100 text-pink-700" : "bg-rose-50/40 border-rose-100 text-rose-700"} border text-xs font-medium space-y-1`}>
                <p className="font-bold flex items-center gap-1">
                  <Shield size={14} /> MongoDB Security Verified
                </p>
                <p className="text-[11px] leading-relaxed">
                  Saving a password allows {isAfrin ? "Afrin" : "Rayhan"} to sign in directly via email & password alongside Google OAuth.
                </p>
              </div>
            </div>

            {/* Password Best Practices Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Password Guidelines
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  At least 6 characters long
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  Mix of uppercase & lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  At least one number (0-9)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  At least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PREFERENCES & SESSIONS */}
      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Login Sessions (7 Columns) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Laptop size={20} className={isAfrin ? "text-pink-500" : "text-rose-500"} />
                  Active Login Sessions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Devices currently signed into {isAfrin ? "Afrin" : "Rayhan"}'s account
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {sessions.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      {sess.type === "desktop" ? <Laptop size={18} /> : <Smartphone size={18} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {sess.device}
                        </p>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-700 rounded-full uppercase">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {sess.ip} • {sess.lastActive}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className={`px-3 py-1.5 text-xs font-bold ${isAfrin ? "text-pink-600 hover:bg-pink-50" : "text-rose-600 hover:bg-rose-50"} rounded-xl transition-all cursor-pointer shrink-0`}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preferences & Notifications Toggles (5 Columns) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell size={18} className="text-purple-500" />
                Notification & Privacy Preferences
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Digest Notifications</p>
                  <p className="text-[10px] text-slate-400">Weekly memory activity summaries</p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    emailAlerts
                      ? isAfrin ? "bg-pink-500 justify-end" : "bg-rose-500 justify-end"
                      : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">New Login Alert</p>
                  <p className="text-[10px] text-slate-400">Alert on new device sign-ins</p>
                </div>
                <button
                  onClick={() => setLoginNotify(!loginNotify)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    loginNotify ? "bg-purple-500 justify-end" : "bg-slate-300 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}