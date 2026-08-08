"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FilePlus,
  Send,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Gift,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function CreateRequestPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    type: "Surprise Date Request",
    priority: "Medium",
    details: "",
    date: "",
    location: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.details) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const newRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      user: user?.name || "Afrin Yesmin",
      avatar: user?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      type: formData.type,
      title: formData.title,
      dateSubmitted: "Just now",
      priority: formData.priority,
      status: "Pending Admin Approval",
      details: formData.details,
      location: formData.location,
      preferredDate: formData.date,
    };

    // Save request to localStorage so Rayhan's & Afrin's dashboards pick it up
    try {
      const existing = JSON.parse(localStorage.getItem("rayhan_afrin_requests") || "[]");
      localStorage.setItem("rayhan_afrin_requests", JSON.stringify([newRequest, ...existing]));
    } catch (err) {
      console.error("Failed to save request to localStorage", err);
    }

    setSubmitted(true);
    toast.success("Request sent to Rayhan! ❤️");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Back to Dashboard Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 rounded-full flex items-center gap-1.5">
          <Heart size={12} className="fill-rose-500 text-rose-500 animate-pulse" />
          Orbit Request Hub
        </span>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-rose-100 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Request Dispatched! ✨
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your request "<span className="font-semibold text-slate-800">{formData.title}</span>" has been securely transmitted to Rayhan's approval queue.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: "",
                  type: "Surprise Date Request",
                  priority: "Medium",
                  details: "",
                  date: "",
                  location: "",
                });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all"
            >
              Submit Another Request
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden">
          {/* Form Banner Header */}
          <div className="bg-linear-to-r from-rose-600 via-pink-600 to-slate-900 p-6 md:p-8 text-white relative">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <FilePlus size={20} className="text-rose-200" />
                </span>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Create a New Request
                </h1>
              </div>
              <p className="text-xs md:text-sm text-rose-100/90 max-w-lg leading-relaxed">
                Submit your surprise date ideas, document release requests, or special wishlist items directly to Rayhan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Request Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Request Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { type: "Surprise Date Request", icon: Sparkles, color: "text-rose-500 bg-rose-50 border-rose-200" },
                  { type: "Document Release", icon: FileText, color: "text-purple-500 bg-purple-50 border-purple-200" },
                  { type: "Wishlist Item", icon: Gift, color: "text-amber-500 bg-amber-50 border-amber-200" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.type === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: item.type })}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? `ring-2 ring-rose-500 border-rose-300 font-bold ${item.color}`
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs">{item.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Request Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Weekend Getaway to Cox's Bazar or Passport Copy Release"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
              />
            </div>

            {/* Priority & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm bg-white"
                >
                  <option value="High">🔥 High Priority (Urgent)</option>
                  <option value="Medium">⚡ Medium Priority</option>
                  <option value="Low">🌱 Low Priority (Casual)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preferred Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Destination / Location (Optional)
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Ocean View Resort or Online Document Drive"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            {/* Details Description Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Request Details & Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your request in detail for Rayhan..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Send size={15} />
                Submit Request to Rayhan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
