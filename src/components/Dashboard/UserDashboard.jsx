"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import {
  Heart,
  Sparkles,
  User,
  Mail,
  BookOpen,
  Gamepad2,
  Camera,
  ShieldCheck,
  Lock,
  ArrowRight,
  Send,
  Check,
  Smile,
  Calendar,
  MapPin,
  Phone,
  Droplet,
} from "lucide-react";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [noteTag, setNoteTag] = useState("Sweet Wish");
  const [noteEmoji, setNoteEmoji] = useState("💌");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendNote = async (e) => {
    e.preventDefault();
    if (!noteMessage.trim()) {
      toast.error("Please write a sweet message first!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle,
          message: noteMessage,
          tag: noteTag,
          emoji: noteEmoji,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send note.");
      }

      setIsSuccess(true);
      toast.success("Your sweet note was delivered to RayHan & Afrin! 💌");
      setNoteTitle("");
      setNoteMessage("");

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      toast.error(err.message || "Failed to send note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 bg-linear-to-r from-rose-500 via-pink-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs">
              <Sparkles size={13} className="text-amber-300" />
              Orbit Member Sanctuary
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name || "Friend"}! ✨
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
              Thank you for being part of RayHan & Afrin's love journey. Explore our story, enjoy couple activities, or send a sweet note to both of them.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/20 bg-black/20 p-3 backdrop-blur-md">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/40 bg-white/10">
              <img
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "User Avatar"}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">{user?.name || "Member"}</span>
              <span className="block text-[10px] font-medium text-rose-200">{user?.email}</span>
              <span className="mt-0.5 inline-block rounded-full bg-emerald-400/20 border border-emerald-300/40 px-2 py-0.5 text-[9px] font-bold text-emerald-200">
                Active Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Discovery Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/story"
          className="group relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-6 shadow-xs transition hover:border-rose-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 transition group-hover:scale-110">
              <BookOpen size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-rose-600" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">Our Love Story</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Read through the beautiful chapters and milestones of RayHan & Afrin.
          </p>
        </Link>

        <Link
          href="/activities"
          className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-xs transition hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-600 transition group-hover:scale-110">
              <Gamepad2 size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">Fun Activities</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Discover cute quizzes, love coupons, date deciders, and fun couple games.
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group relative overflow-hidden rounded-3xl border border-amber-100 bg-white p-6 shadow-xs transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:scale-110">
              <User size={22} />
            </div>
            <ArrowRight size={18} className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-amber-600" />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">My Profile</h3>
          <p className="mt-1 text-xs text-gray-500 leading-relaxed">
            Manage your personal credentials, phone number, and location details.
          </p>
        </Link>
      </div>

      {/* ── Main Layout: Send Sweet Note + Member Info ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Send a Sweet Note Widget */}
        <div className="lg:col-span-7 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💌</span>
                <h2 className="text-lg font-black text-gray-900">
                  Send a Sweet Note to RayHan & Afrin
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                Your message will be sent directly to RayHan & Afrin's private vault.
              </p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Note Delivered Successfully! 💌</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Thank you for your warm words! RayHan and Afrin will read your sweet note in their private dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendNote} className="mt-5 space-y-4">
              {/* Note Tag & Emoji Stamps */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {["Sweet Wish", "Love Blessing", "Heartfelt Advice", "Warm Memory"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNoteTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                        noteTag === tag
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-1.5">
                  {["💌", "💖", "✨", "🌸", "🥂"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNoteEmoji(emoji)}
                      className={`grid h-8 w-8 place-items-center rounded-lg text-sm transition cursor-pointer ${
                        noteEmoji === emoji
                          ? "bg-rose-100 border border-rose-300 scale-110"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Subject / Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="E.g., Wishing you both endless happiness..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Sweet Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  placeholder="Write your heartfelt blessing, cute message, or memory for RayHan & Afrin..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs leading-relaxed text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 py-3 text-xs font-bold text-white shadow-xs transition hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 cursor-pointer"
              >
                <Send size={14} />
                {isSubmitting ? "Sending..." : "Deliver Note to RayHan & Afrin"}
              </button>
            </form>
          )}
        </div>

        {/* Member Profile Details & Security Notice */}
        <div className="lg:col-span-5 space-y-6">
          {/* Member Details */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User size={16} className="text-rose-500" />
              Member Profile Snapshot
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Full Name</span>
                <span className="font-bold text-gray-800">{user?.name || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="font-semibold text-gray-700">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Phone</span>
                <span className="font-semibold text-gray-700">{user?.phone || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Role</span>
                <span className="rounded-full bg-rose-100 text-rose-700 px-2.5 py-0.5 font-bold uppercase text-[10px]">
                  {user?.role || "User"}
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/profile"
              className="block w-full text-center rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
            >
              Edit My Profile
            </Link>
          </div>

          {/* Privacy & Security Notice */}
          <div className="rounded-3xl border border-pink-100 bg-linear-to-br from-rose-50/50 to-pink-50/30 p-6 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <Lock size={15} />
              Private Sanctuary Notice
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Administrative management, user moderation, photo uploads, and secret notes archives are exclusively reserved for <strong>RayHan</strong> & <strong>Afrin</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}