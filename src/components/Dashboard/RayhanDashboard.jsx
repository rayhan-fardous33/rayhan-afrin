"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Camera,
  FileText,
  Heart,
  ShieldCheck,
  Lock,
  Sparkles,
  UserCheck,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Calendar,
  MapPin,
  Server,
  HardDrive,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Sliders,
  Eye,
  Send,
  Share2,
  Shield,
  Key,
  Check,
  Zap,
  Filter,
  Layers,
  HeartHandshake,
} from "lucide-react";

import {
  adminProfile,
  adminStats,
  systemMetrics,
  memoryCategories,
  monthlyActivity,
  pendingRequests as initialPendingRequests,
  recentActivities,
  upcomingEvents,
  featuredMemory,
} from "@/lib/admin-dashboard-data";

export default function RayhanDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState(initialPendingRequests);
  const [logFilter, setLogFilter] = useState("All");
  const [adminNote, setAdminNote] = useState(
    "❤️ Note to Afrin: Preparing our surprise weekend trip itinerary! Check your requests tab for updates."
  );
  const [noteSaved, setNoteSaved] = useState(false);
  // Dynamic Stats States
  const [users, setUsers] = useState([]);
  const [memoriesCount, setMemoriesCount] = useState(142);
  const [daysTogether, setDaysTogether] = useState(201);

  useEffect(() => {
    // 1. Calculate Days Together
    const anniv = new Date("2026-01-14T14:18:00");
    const now = new Date();
    const diff = Math.ceil(Math.abs(now - anniv) / (1000 * 60 * 60 * 24));
    setDaysTogether(diff);

    // 2. Fetch Dynamic Users Count & Breakdown from API
    fetch("/api/user/all-users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      })
      .catch((err) => console.error("Failed to fetch users for dashboard stats:", err));

    // 3. Fetch Dynamic Memories Count
    fetch("/api/memories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.memories)) {
          setMemoriesCount(data.memories.length);
        }
      })
      .catch((err) => console.error("Failed to fetch memories for dashboard stats:", err));
  }, []);

  const activeUserCount = users.filter((u) => (u.status || "Active").toLowerCase() !== "blocked").length || (users.length > 0 ? users.length : 3);
  const rayhanCount = users.filter((u) => u.role === "Rayhan").length || 1;
  const afrinCount = users.filter((u) => u.role === "Afrin").length || 1;
  const memberCount = users.filter((u) => u.role === "User" || (!u.role && u.role !== "Rayhan" && u.role !== "Afrin")).length;

  const dynamicUserDescription = users.length > 0
    ? `${rayhanCount} Admin (Rayhan), ${afrinCount} VIP (Afrin), ${memberCount} Member${memberCount === 1 ? "" : "s"}`
    : "1 Admin (Rayhan), 1 VIP (Afrin), 1 Member";

  const dynamicStats = [
    {
      id: "total_users",
      title: "Registered Users",
      value: `${activeUserCount} Active ${activeUserCount === 1 ? "User" : "Users"}`,
      change: `+${users.length > 0 ? users.length : 3} total`,
      isPositive: true,
      description: dynamicUserDescription,
      icon: "Users",
      color: "from-rose-500 to-pink-600",
      lightBg: "bg-rose-50 border-rose-100 text-rose-600",
      href: "/dashboard/allUsers",
    },
    {
      id: "total_memories",
      title: "Shared Memories",
      value: `${memoriesCount} Entries`,
      change: "+14 this week",
      isPositive: true,
      description: "Photos, videos & heart-felt journal notes",
      icon: "Camera",
      color: "from-pink-500 to-purple-600",
      lightBg: "bg-pink-50 border-pink-100 text-pink-600",
      href: "/dashboard/allMemories",
    },
    {
      id: "total_documents",
      title: "Vault Documents",
      value: "38 Files",
      change: "+3 uploaded",
      isPositive: true,
      description: "Medical reports, travel passes & keys",
      icon: "FileText",
      color: "from-purple-500 to-indigo-600",
      lightBg: "bg-purple-50 border-purple-100 text-purple-600",
      href: "/dashboard/allDocuments",
    },
    {
      id: "days_together",
      title: "Days of Togetherness",
      value: `${daysTogether} Days`,
      change: "Forever & Always",
      isPositive: true,
      description: "Since January 14, 2026 • Love score 100%",
      icon: "Heart",
      color: "from-amber-500 to-rose-500",
      lightBg: "bg-amber-50 border-amber-100 text-amber-600",
      href: "/dashboard/profile",
    },
  ];

  const [toggles, setToggles] = useState({
    vaultAccess: true,
    autoBackup: true,
    instantNotify: true,
    securityLock: true,
  });

  // Action Handlers for Requests
  const handleApproveRequest = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved by Rayhan" } : req
      )
    );
  };

  const handleRejectRequest = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Declined" } : req
      )
    );
  };

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  // Filtered Logs
  const filteredActivities =
    logFilter === "All"
      ? recentActivities
      : recentActivities.filter(
          (act) => act.category.toLowerCase() === logFilter.toLowerCase()
        );

  const pendingCount = requests.filter(
    (r) => r.status.includes("Pending") || r.status.includes("Review")
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TOP HEADER & GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-rose-950/20 border border-rose-700/40">
        {/* Background Decorative Glow Circles */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-48 h-48 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-500/30 text-rose-200 border border-rose-400/30 rounded-full backdrop-blur-md flex items-center gap-1.5">
                <Shield size={13} className="text-rose-300" />
                {adminProfile.role}
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {adminProfile.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome Back, Rayhan! 👋
            </h1>
            <p className="text-sm md:text-base text-rose-100/80 max-w-2xl font-normal leading-relaxed">
              Orbit Command Center is synchronized. All security protocols are active and love metrics are running at full capacity.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/allMemories"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              Add Memory
            </Link>
            <Link
              href="/dashboard/allDocuments"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <FileText size={15} />
              Upload Doc
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ADMIN STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dynamicStats.map((stat) => {
          const IconComponent =
            stat.icon === "Users"
              ? Users
              : stat.icon === "Camera"
              ? Camera
              : stat.icon === "FileText"
              ? FileText
              : Heart;

          return (
            <Link
              key={stat.id}
              href={stat.href}
              className="group relative bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              {/* Subtle top accent gradient */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color}`}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${stat.lightBg}`}
                  >
                    <IconComponent size={22} />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {stat.change}
                  </span>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight group-hover:text-rose-600 transition-colors">
                  {stat.value}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">{stat.description}</span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. SYSTEM HEALTH & ADMIN CONTROL BAR */}
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Storage Meter */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <HardDrive size={16} className="text-rose-500" />
                Orbit Storage Capacity
              </span>
              <span>
                {systemMetrics.storageUsedGB} GB / {systemMetrics.storageTotalGB} GB (
                {systemMetrics.storagePercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${systemMetrics.storagePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Backups synchronized • Last backup {systemMetrics.lastBackup}
            </p>
          </div>

          <div className="h-px lg:h-12 w-full lg:w-px bg-slate-100" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Database</p>
              <p className="text-xs font-extrabold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} />
                {systemMetrics.databaseStatus}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">API Latency</p>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                {systemMetrics.apiLatencyMs} ms
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Shield</p>
              <p className="text-xs font-extrabold text-purple-600 mt-0.5 flex items-center justify-center gap-1">
                <ShieldCheck size={12} />
                Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN TABBED NAVIGATION & CONTROLS */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
              }`}
            >
              <Activity size={15} />
              Overview & Analytics
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative cursor-pointer ${
                activeTab === "requests"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
              }`}
            >
              <Clock size={15} />
              Pending Requests
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-900 rounded-full font-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "activities"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
              }`}
            >
              <Layers size={15} />
              Audit Log Timeline
            </button>

            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "events"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 border border-pink-100"
              }`}
            >
              <Calendar size={15} />
              Upcoming Events
            </button>
          </div>

          {/* Quick Refresh Indicator */}
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <RefreshCw size={12} className="animate-spin text-rose-500" />
            Live Synced
          </span>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Monthly Trend Chart & Memory Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Monthly Activity Bar Visualization */}
              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp size={18} className="text-rose-500" />
                      Orbit Growth & Activity Trends (2026)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Memories uploaded vs document transfers across months
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                      Memories
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-3 h-3 rounded-sm bg-purple-400 inline-block" />
                      Docs
                    </span>
                  </div>
                </div>

                {/* Simulated Custom CSS Bar Chart */}
                <div className="pt-6 pb-2 px-2 flex items-end justify-between gap-3 h-48 border-b border-slate-100">
                  {monthlyActivity.map((item, idx) => {
                    const maxVal = 40;
                    const memHeight = (item.memories / maxVal) * 100;
                    const docHeight = (item.documents / maxVal) * 100;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        <div className="w-full flex items-end justify-center gap-1 h-full">
                          {/* Memories Bar */}
                          <div
                            className="w-1/2 max-w-[24px] bg-linear-to-t from-rose-600 to-rose-400 rounded-t-md group-hover:brightness-110 transition-all relative"
                            style={{ height: `${memHeight}%` }}
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                              {item.memories}
                            </span>
                          </div>
                          {/* Docs Bar */}
                          <div
                            className="w-1/2 max-w-[24px] bg-linear-to-t from-purple-500 to-purple-300 rounded-t-md group-hover:brightness-110 transition-all relative"
                            style={{ height: `${docHeight}%` }}
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                              {item.documents}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Memory Categories Distribution */}
              <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500" />
                  Memory Vault Distribution
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memoryCategories.map((cat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>{cat.name}</span>
                        <span>{cat.count} items ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} rounded-full`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Featured Memory Spotlight & Admin Note Box */}
            <div className="space-y-6">
              {/* Featured Memory Card */}
              <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="relative h-48 w-full group overflow-hidden">
                  <img
                    src={featuredMemory.image}
                    alt={featuredMemory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm uppercase tracking-wider flex items-center gap-1">
                    <Heart size={10} className="fill-white" />
                    Featured Spotlight
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-rose-200 flex items-center gap-1 font-medium">
                      <MapPin size={12} /> {featuredMemory.location} • {featuredMemory.date}
                    </p>
                    <h4 className="text-base font-bold tracking-tight">
                      {featuredMemory.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{featuredMemory.caption}"
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-rose-600 flex items-center gap-1">
                      <Heart size={13} className="fill-rose-500 text-rose-500" />
                      {featuredMemory.likes} Love Reactions
                    </span>
                    <Link
                      href="/dashboard/allMemories"
                      className="text-slate-700 hover:text-rose-600 font-bold flex items-center gap-1"
                    >
                      View Vault <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Admin Sticky Broadcast Note */}
              <div className="bg-linear-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-600 fill-amber-600/20" />
                    Admin Announcement Note
                  </h4>
                  {noteSaved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Saved
                    </span>
                  )}
                </div>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl text-xs bg-white/80 border border-amber-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none font-medium"
                />

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-amber-700/80 font-medium">
                    Visible on Afrin's Orbit Dashboard
                  </p>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING REQUESTS & APPROVALS */}
        {activeTab === "requests" && (
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock size={20} className="text-rose-500" />
                  Pending Approvals Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Review and authorize requests submitted by Afrin or orbit users
                </p>
              </div>

              <span className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-100 w-fit">
                {pendingCount} Pending Item(s)
              </span>
            </div>

            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No requests pending in queue.
                </div>
              ) : (
                requests.map((req) => {
                  const isPending =
                    req.status.includes("Pending") || req.status.includes("Review");

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-pink-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={req.avatar}
                          alt={req.user}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {req.title}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                req.priority === "High"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : req.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {req.priority} Priority
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 font-medium">
                            Submitted by <span className="font-bold text-slate-800">{req.user}</span> ({req.type}) • {req.dateSubmitted}
                          </p>
                          <p className="text-xs text-slate-500 pt-1 max-w-xl">
                            {req.details}
                          </p>
                        </div>
                      </div>

                      {/* Request Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="px-3 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border flex items-center gap-1.5 ${
                              req.status.includes("Approved")
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {req.status.includes("Approved") ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOG TIMELINE */}
        {activeTab === "activities" && (
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers size={20} className="text-purple-500" />
                  Real-time Audit & Activity Feed
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive log of events across memories, documents, and admin security
                </p>
              </div>

              {/* Log Category Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {["All", "Memory", "Document", "System"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLogFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      logFilter === cat
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-slate-100 hover:bg-rose-50/20 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={act.avatar}
                      alt={act.user}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {act.action}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        By <span className="text-slate-600">{act.user}</span> • {act.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${act.badgeColor}`}
                  >
                    {act.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UPCOMING EVENTS & MILESTONES */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${event.color}`}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                      {event.category}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
                      ⏳ {event.daysLeft} Days Left
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 pt-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar size={13} className="text-rose-500" />
                    {event.date}
                  </p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin size={13} className="text-purple-500" />
                    {event.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium italic">
                  💡 "{event.highlight}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. QUICK ADMIN FEATURE TOGGLES */}
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders size={18} className="text-rose-500" />
          Admin Orbit Feature Control Grid
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Public Memory Access</p>
              <p className="text-[10px] text-slate-400">Allow shared album links</p>
            </div>
            <button
              onClick={() => handleToggle("vaultAccess")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                toggles.vaultAccess ? "bg-rose-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Automated Daily Backup</p>
              <p className="text-[10px] text-slate-400">Sync database to Cloud</p>
            </div>
            <button
              onClick={() => handleToggle("autoBackup")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                toggles.autoBackup ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Instant Alert Push</p>
              <p className="text-[10px] text-slate-400">Notify Rayhan on requests</p>
            </div>
            <button
              onClick={() => handleToggle("instantNotify")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                toggles.instantNotify ? "bg-purple-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">2FA Security Lock</p>
              <p className="text-[10px] text-slate-400">Require token on doc delete</p>
            </div>
            <button
              onClick={() => handleToggle("securityLock")}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                toggles.securityLock ? "bg-amber-500 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}