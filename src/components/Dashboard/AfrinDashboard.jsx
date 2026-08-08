"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Camera,
  FileText,
  FilePlus,
  Sparkles,
  Plus,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Gift,
  Ticket,
  MessageSquare,
  Compass,
  ArrowRight,
  TrendingUp,
  Shield,
  Smile,
  X,
  Coffee,
  Plane,
  Wine,
  PartyPopper,
  BookOpen,
  Award,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { toast } from "react-toastify";

// Default Memories for Afrin's Dashboard preview
const INITIAL_AFRIN_MEMORIES = [
  {
    id: 1,
    title: "Sunset Walk at Ramna Park 🌳",
    date: "May 14, 2026",
    location: "Ramna Park, Dhaka",
    category: "trips",
    desc: "After college, we walked through the peaceful green paths together. Hand in hand, listening to the birds and sharing quiet laughter.",
    imageUrl: "https://i.ibb.co.com/60ZhcHZW/IMG-20260514-134231.jpg",
  },
  {
    id: 2,
    title: "The First UNO Game & Burger 🍔",
    date: "May 11, 2026",
    location: "Chillox, Dhanmondi",
    category: "dates",
    desc: "Our competitive UNO match at Chillox! Shared french fries, endless giggles, and making funny face bets.",
    imageUrl: "https://i.ibb.co.com/kgp6gYRd/20260511-123515-1.jpg",
  },
  {
    id: 3,
    title: "Movie Date at Cineplex 🎬",
    date: "May 05, 2026",
    location: "Bashundhara City",
    category: "dates",
    desc: "Shared large butter popcorn and holding hands throughout the dark theater. A classic date night that felt like pure magic.",
    imageUrl: "https://i.ibb.co.com/QjHy6Z1p/IMG-20260505-122313.jpg",
  },
];

// Initial Love Coupons
const INITIAL_COUPONS = [
  {
    id: 1,
    title: "Cozy Breakfast in Bed 🥞",
    description: "Fresh morning stack of pancakes or eggs, made by Rayhan and delivered right to your bed.",
    category: "food",
    status: "available",
    emoji: "🍳",
    color: "from-amber-500/10 to-rose-500/10 border-amber-200 text-amber-900",
  },
  {
    id: 2,
    title: "Movie Night Choice Pass 🍿",
    description: "Total control of the TV remote, movie selection, and snack choices tonight with zero objections!",
    category: "cozy",
    status: "available",
    emoji: "🎬",
    color: "from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-900",
  },
  {
    id: 3,
    title: "30-Min Stress-Melting Massage 💆‍♀️",
    description: "Entitles Afrin to a relaxing shoulder & back massage with scented oils and soothing music.",
    category: "pamper",
    status: "claimed",
    redeemedDate: "July 24, 2026",
    emoji: "🌸",
    color: "from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-900",
  },
  {
    id: 4,
    title: "Late Night Ice Cream Drive 🍦",
    description: "Rayhan will drive out to get double-scoop ice creams no matter what hour it is!",
    category: "food",
    status: "available",
    emoji: "🍨",
    color: "from-sky-500/10 to-indigo-500/10 border-sky-200 text-sky-900",
  },
];

// Initial Love Notes
const INITIAL_LOVE_NOTES = [
  {
    id: 1,
    sender: "Rayhan",
    text: "Good morning my queen! 💖 Just wanted to remind you how deeply loved and cherished you are today.",
    time: "Today at 08:30 AM",
    unread: true,
  },
  {
    id: 2,
    sender: "Rayhan",
    text: "I packed your favorite snacks for your afternoon break. Hope it puts a cute smile on your face! 😊✨",
    time: "Yesterday",
    unread: false,
  },
];

export default function AfrinDashboard() {
  // State Management
  const [memories, setMemories] = useState(INITIAL_AFRIN_MEMORIES);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [loveNotes, setLoveNotes] = useState(INITIAL_LOVE_NOTES);
  const [activeActivityTab, setActiveActivityTab] = useState("coupons");
  const [memoryFilter, setMemoryFilter] = useState("all");
  
  // Modals & Lightbox
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  // New Memory Form State
  const [newMemory, setNewMemory] = useState({
    title: "",
    date: "",
    location: "",
    category: "dates",
    desc: "",
    imageUrl: "",
  });

  // Afrin Sticky Note Response State
  const [afrinReplyNote, setAfrinReplyNote] = useState("");
  const [pinnedReplies, setPinnedReplies] = useState([
    "Can't wait for our surprise weekend trip! 🥰❤️",
  ]);

  // Days Together Calculation
  const [daysTogether, setDaysTogether] = useState(201);

  useEffect(() => {
    const anniv = new Date("2026-01-14T14:18:00");
    const now = new Date();
    const diff = Math.ceil(Math.abs(now - anniv) / (1000 * 60 * 60 * 24));
    setDaysTogether(diff);
  }, []);

  // Load user memories & coupons from localStorage on mount
  useEffect(() => {
    try {
      const storedMemories = JSON.parse(localStorage.getItem("rayhan_afrin_memories") || "[]");
      if (Array.isArray(storedMemories) && storedMemories.length > 0) {
        setMemories([...storedMemories, ...INITIAL_AFRIN_MEMORIES]);
      }

      const storedCoupons = JSON.parse(localStorage.getItem("rayhan_afrin_coupons") || "[]");
      if (Array.isArray(storedCoupons) && storedCoupons.length > 0) {
        setCoupons(storedCoupons);
      }
    } catch (err) {
      console.error("Error loading localStorage data for Afrin dashboard", err);
    }
  }, []);

  // Action: Add Memory
  const handleAddMemorySubmit = (e) => {
    e.preventDefault();
    if (!newMemory.title) {
      toast.error("Memory Title is required!");
      return;
    }

    const created = {
      id: Date.now(),
      title: newMemory.title,
      date: newMemory.date || "Today",
      location: newMemory.location || "Somewhere Perfect",
      category: newMemory.category || "dates",
      desc: newMemory.desc || "A golden moment added to Afrin's scrapbooks.",
      imageUrl:
        newMemory.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80",
    };

    const updated = [created, ...memories];
    setMemories(updated);

    try {
      const existing = JSON.parse(localStorage.getItem("rayhan_afrin_memories") || "[]");
      localStorage.setItem("rayhan_afrin_memories", JSON.stringify([created, ...existing]));
    } catch (err) {
      console.error("Error saving memory to localStorage", err);
    }

    setIsAddMemoryOpen(false);
    setNewMemory({
      title: "",
      date: "",
      location: "",
      category: "dates",
      desc: "",
      imageUrl: "",
    });
    toast.success("New Memory pinned with love! 💖");
  };

  // Action: Redeem Love Coupon
  const handleRedeemCoupon = (id) => {
    const updatedCoupons = coupons.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "claimed",
            redeemedDate: "Just Now",
          }
        : c
    );
    setCoupons(updatedCoupons);
    try {
      localStorage.setItem("rayhan_afrin_coupons", JSON.stringify(updatedCoupons));
    } catch (err) {
      console.error(err);
    }
    toast.success("Coupon Redeemed! Rayhan will fulfill this coupon for you! 🎉❤️");
  };

  // Action: Send Quick Reply Note
  const handleSendReplyNote = (e) => {
    e.preventDefault();
    if (!afrinReplyNote.trim()) return;
    setPinnedReplies([afrinReplyNote, ...pinnedReplies]);
    setAfrinReplyNote("");
    toast.success("Sticky note left for Rayhan! 📝❤️");
  };

  // Filtered Memories for Gallery
  const filteredMemories = memories.filter((m) => {
    if (memoryFilter === "all") return true;
    return m.category === memoryFilter;
  });

  const availableCouponsCount = coupons.filter((c) => c.status === "available").length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. HERO GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-rose-600 via-pink-600 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-rose-950/15 border border-pink-400/30">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/15 text-rose-100 border border-white/20 rounded-full backdrop-blur-md flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-300 fill-amber-300" />
                👑 Afrin's VIP Orbit
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online & Protected by Rayhan
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome Back, Afrin! ✨💖
            </h1>
            <p className="text-sm md:text-base text-rose-100/90 max-w-2xl font-normal leading-relaxed">
              Your personal dashboard is live. Explore your memories, redeem love coupons, check upcoming romantic plans, and submit requests to Rayhan!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddMemoryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              Add Memory
            </button>
            <Link
              href="/dashboard/create-request"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500/80 hover:bg-rose-500 text-white border border-rose-400/40 text-xs font-semibold rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <FilePlus size={15} />
              Create Request
            </Link>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl backdrop-blur-md transition-all cursor-pointer"
            >
              <Compass size={15} />
              All Activities
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS & LOVE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Days Together */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <Heart size={22} className="fill-rose-500" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              Score: 100%
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Days of Togetherness
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {daysTogether} Days
          </h3>
          <p className="text-xs text-slate-500 mt-1">Since January 14, 2026</p>
        </div>

        {/* Shared Memories */}
        <div
          onClick={() => setIsAddMemoryOpen(true)}
          className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center">
              <Camera size={22} />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-100 group-hover:bg-pink-100 transition-colors">
              + Pin New
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Memories
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {memories.length} Entries
          </h3>
          <p className="text-xs text-slate-500 mt-1">Photos, dates & adventures</p>
        </div>

        {/* Available Love Coupons */}
        <div
          onClick={() => setActiveActivityTab("coupons")}
          className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <Gift size={22} />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Ready to Redeem
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Love Coupons
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {availableCouponsCount} Available
          </h3>
          <p className="text-xs text-slate-500 mt-1">Breakfast, massages & passes</p>
        </div>

        {/* Requests Status */}
        <Link
          href="/dashboard/create-request"
          className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              Approved (2)
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Orbit Requests
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            2 Approved / 1 Pending
          </h3>
          <p className="text-xs text-slate-500 mt-1">Surprise date & passport release</p>
        </Link>
      </div>

      {/* 3. RELEVANT ACTIVITIES HUB WIDGET */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 border-b border-rose-50 bg-linear-to-r from-rose-50/40 via-pink-50/20 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <HeartHandshake size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Afrin's Activity & Interactive Hub
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Redeem love coupons, check secret notes, and participate in shared couple activities.
            </p>
          </div>

          {/* Activity Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {[
              { id: "coupons", label: "Love Coupons", icon: Gift },
              { id: "notes", label: "Love Notes", icon: MessageSquare },
              { id: "milestones", label: "Milestones", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeActivityTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveActivityTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Tab Content Area */}
        <div className="p-6 md:p-8">
          {/* TAB 1: LOVE COUPONS */}
          {activeActivityTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Afrin's Redeemable Coupons 🎟️
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click "Redeem Now" to claim any coupon with Rayhan!
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  View All Activities <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`relative p-5 rounded-2xl border bg-gradient-to-br ${coupon.color} flex flex-col justify-between space-y-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{coupon.emoji}</span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            {coupon.title}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            {coupon.category}
                          </span>
                        </div>
                      </div>
                      {coupon.status === "claimed" ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} /> Claimed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {coupon.description}
                    </p>

                    <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400">
                        {coupon.status === "claimed"
                          ? `Redeemed: ${coupon.redeemedDate}`
                          : "Issued by Rayhan ❤️"}
                      </span>
                      {coupon.status === "available" && (
                        <button
                          onClick={() => handleRedeemCoupon(coupon.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          Redeem Now ✨
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LOVE NOTES & SECRET MESSAGES */}
          {activeActivityTab === "notes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Notes & Secret Messages from Rayhan 💌
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sweet messages pinned in your orbit.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {loveNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-500 text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                      R
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">
                          {note.sender} Fardous
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {note.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        "{note.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave a Sticky Reply Form */}
              <form
                onSubmit={handleSendReplyNote}
                className="pt-4 border-t border-slate-100 space-y-3"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Leave a Sticky Note Reply for Rayhan 📝
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a sweet reply note to Rayhan..."
                    value={afrinReplyNote}
                    onChange={(e) => setAfrinReplyNote(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={14} /> Send
                  </button>
                </div>

                {/* Display Pinned Replies */}
                {pinnedReplies.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Afrin's Pinned Notes to Rayhan:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pinnedReplies.map((reply, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium"
                        >
                          📌 {reply}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: UPCOMING MILESTONES & EVENTS */}
          {activeActivityTab === "milestones" && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-800">
                Upcoming Milestones & Romantic Dates 🗓️
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Afrin's Birthday 🎂",
                    date: "August 28, 2026",
                    location: "Surprise Rooftop Venue",
                    details: "Rayhan is arranging photobook + gift",
                    daysLeft: "26 Days Left",
                    badge: "bg-purple-50 text-purple-700 border-purple-200",
                  },
                  {
                    title: "Rayhan & Afrin Anniversary 💕",
                    date: "October 14, 2026",
                    location: "Sylhet Tea Gardens Resort",
                    details: "Candlelight dinner under the stars",
                    daysLeft: "73 Days Left",
                    badge: "bg-rose-50 text-rose-700 border-rose-200",
                  },
                  {
                    title: "Sajek Valley Retreat 🌲",
                    date: "December 05, 2026",
                    location: "Sajek Valley Cottage",
                    details: "Stargazing, bonfire & cloud gazing",
                    daysLeft: "125 Days Left",
                    badge: "bg-amber-50 text-amber-700 border-amber-200",
                  },
                ].map((event, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-900">
                        {event.title}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${event.badge}`}
                      >
                        {event.daysLeft}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p className="flex items-center gap-1">
                        <Calendar size={13} className="text-rose-500" /> {event.date}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin size={13} className="text-rose-500" /> {event.location}
                      </p>
                    </div>
                    <p className="text-xs text-slate-700 font-medium italic pt-2 border-t border-slate-200/60">
                      "{event.details}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. SCRAPBOOK MEMORIES PREVIEW & ALL MEMORIES */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>📸</span> Afrin's Memory Scrapbook
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Captured date nights, trips, and cherished everyday moments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
              {[
                { id: "all", label: "All" },
                { id: "dates", label: "Dates 🍷" },
                { id: "trips", label: "Trips ✈️" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMemoryFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    memoryFilter === f.id
                      ? "bg-rose-500 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddMemoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Add Memory
            </button>
          </div>
        </div>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedMemory(mem)}
              className="group relative bg-white p-4 pb-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md rounded-full text-slate-800 shadow-xs">
                  {mem.category}
                </span>
              </div>

              <div className="pt-4 text-left">
                <h3 className="font-serif font-bold text-slate-900 text-base leading-tight group-hover:text-rose-600 transition-colors">
                  {mem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                  {mem.desc}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>📅 {mem.date}</span>
                  <span>📍 {mem.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link to view All Memories */}
        <div className="pt-2 text-center">
          <Link
            href="/dashboard/allMemories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs shadow-sm transition-all"
          >
            <span>View All Memories in Vault</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 5. RAYHAN'S NOTE & AFRIN'S QUICK RESPONSE BOX */}
      <div className="p-6 md:p-8 rounded-3xl bg-linear-to-r from-rose-900 via-rose-800 to-slate-900 text-white shadow-xl space-y-4 border border-rose-700/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/20 border border-rose-400/30">
              <Heart size={18} className="text-rose-300 fill-rose-300" />
            </span>
            <h3 className="text-lg font-bold">Pinned Note from Rayhan</h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-white/10 rounded-full text-rose-200 border border-white/10">
            Updated Today
          </span>
        </div>

        <p className="text-sm md:text-base text-rose-100/90 leading-relaxed italic font-serif bg-white/5 p-4 rounded-2xl border border-white/10">
          "❤️ Note to Afrin: Preparing our surprise weekend trip itinerary! Check your requests tab for updates and make sure to pack your favorite summer dress! Love you endlessly."
        </p>
      </div>

      {/* 6. ADD MEMORY MODAL */}
      {isAddMemoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAddMemoryOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 border border-rose-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-rose-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>📸</span> Pin a New Memory
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add a moment to Rayhan & Afrin's scrapbooks
                </p>
              </div>
              <button
                onClick={() => setIsAddMemoryOpen(false)}
                className="text-slate-400 hover:text-rose-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemorySubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Memory Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Coffee at Dhanmondi Lake"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. August 02, 2026"
                    value={newMemory.date}
                    onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    value={newMemory.category}
                    onChange={(e) => setNewMemory({ ...newMemory, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm bg-white"
                  >
                    <option value="dates">🍷 Date Night</option>
                    <option value="trips">✈️ Adventure / Trip</option>
                    <option value="cozy">☕ Cozy Moment</option>
                    <option value="celebrations">🎉 Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uttara Lake Park"
                  value={newMemory.location}
                  onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newMemory.imageUrl}
                  onChange={(e) => setNewMemory({ ...newMemory, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Memory Story / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet memory description..."
                  value={newMemory.desc}
                  onChange={(e) => setNewMemory({ ...newMemory, desc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemoryOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer"
                >
                  Save Memory ❤️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MEMORY LIGHTBOX MODAL */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 bg-slate-100 relative h-64 md:h-auto">
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white relative">
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-rose-100">
                  {selectedMemory.category} 🌸
                </span>
                <h3 className="font-serif text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedMemory.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  📅 {selectedMemory.date} • 📍 {selectedMemory.location}
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                    "{selectedMemory.desc}"
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                Pinned with love in Afrin's Orbit ❤️
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}