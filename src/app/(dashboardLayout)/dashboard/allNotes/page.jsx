"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Mail,
  Heart,
  Star,
  Trash2,
  Check,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
  User,
  ShieldAlert,
  Inbox,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";

export default function AllNotesPage() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRayhan, setIsRayhan] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, favorites, unread
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Check if current user is Rayhan
  useEffect(() => {
    if (session?.user) {
      const rawRole = (session.user.role || "").toString().trim().toLowerCase();
      const rayhan = rawRole === "rayhan" || rawRole === "admin";
      setIsRayhan(rayhan);
    }
  }, [session]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (res.ok) {
        setNotes(data.notes || []);
        if (typeof data.isRayhan === "boolean") {
          setIsRayhan(data.isRayhan);
        }
      } else {
        toast.error(data.error || "Failed to load sweet notes.");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      toast.error("Network error while fetching notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Toggle favorite status (Rayhan & privileged users)
  const handleToggleFavorite = async (note) => {
    const nextVal = !note.isFavorite;
    // Optimistic update
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? { ...n, isFavorite: nextVal } : n))
    );

    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note._id, isFavorite: nextVal }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update favorite status");
      }
      toast.success(
        nextVal
          ? "Note added to favorites! ⭐"
          : "Note removed from favorites."
      );
    } catch (err) {
      // Revert
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, isFavorite: note.isFavorite } : n
        )
      );
      toast.error(err.message || "Failed to toggle favorite");
    }
  };

  // Toggle read status
  const handleToggleRead = async (note) => {
    const nextVal = !note.isRead;
    // Optimistic update
    setNotes((prev) =>
      prev.map((n) => (n._id === note._id ? { ...n, isRead: nextVal } : n))
    );

    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note._id, isRead: nextVal }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update read status");
      }
    } catch (err) {
      // Revert
      setNotes((prev) =>
        prev.map((n) =>
          n._id === note._id ? { ...n, isRead: note.isRead } : n
        )
      );
      toast.error(err.message || "Failed to toggle read status");
    }
  };

  // Delete note (Rayhan only)
  const confirmDelete = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    setDeletingId(noteToDelete._id);

    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteToDelete._id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete note.");
      }

      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
      toast.success("Sweet note deleted successfully.");
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete note.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and Search Logic
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        n.senderName?.toLowerCase().includes(q) ||
        n.senderEmail?.toLowerCase().includes(q) ||
        n.title?.toLowerCase().includes(q) ||
        n.message?.toLowerCase().includes(q) ||
        n.tag?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Filter
      if (activeFilter === "favorites") return Boolean(n.isFavorite);
      if (activeFilter === "unread") return !n.isRead;
      return true;
    });
  }, [notes, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const total = notes.length;
    const favorites = notes.filter((n) => n.isFavorite).length;
    const unread = notes.filter((n) => !n.isRead).length;
    return { total, favorites, unread };
  }, [notes]);

  const formatDate = (dateVal) => {
    if (!dateVal) return "Recently";
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700">
            <Sparkles size={13} className="text-amber-500" />
            RayHan & Afrin's Mailbox
          </div>
          <h1 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
            Sweet Notes & Wishes 💌
          </h1>
          <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
            Personal notes, warm blessings, and secret messages received from friends and visitors.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchNotes}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition hover:bg-gray-50 sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-rose-500" : ""} />
          Refresh Mailbox
        </button>
      </div>

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-100 bg-linear-to-br from-rose-50 to-pink-50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Total Notes
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500 text-white shadow-xs">
              <Mail size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-gray-900">{stats.total}</p>
          <p className="mt-1 text-xs text-rose-600 font-medium">Delivered to RayHan & Afrin</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-linear-to-br from-amber-50 to-yellow-50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Starred Favorites
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Star size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-gray-900">{stats.favorites}</p>
          <p className="mt-1 text-xs text-amber-600 font-medium">Special cherished memories</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-indigo-50 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Unread Notes
            </span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500 text-white shadow-xs">
              <Inbox size={16} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-gray-900">{stats.unread}</p>
          <p className="mt-1 text-xs text-purple-600 font-medium">Awaiting your response</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, subject, or message content..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs text-gray-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              activeFilter === "all"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Notes ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("favorites")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              activeFilter === "favorites"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Star size={13} fill="currentColor" />
            Favorites ({stats.favorites})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("unread")}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
              activeFilter === "unread"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unread ({stats.unread})
          </button>
        </div>
      </div>

      {/* ── Notes Grid / List ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-rose-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-600 animate-spin" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400 animate-pulse">
            Opening Secret Vault Notes...
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <Mail size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-gray-900">No Sweet Notes Found</h3>
          <p className="mt-1 max-w-sm text-xs text-gray-500 leading-relaxed">
            {searchQuery
              ? "No notes matched your search query. Try clearing the search filter."
              : "No sweet notes have been received in this category yet."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
                note.isFavorite
                  ? "border-amber-300/80 bg-linear-to-b from-amber-50/40 via-white to-white shadow-md shadow-amber-500/5 ring-2 ring-amber-400/20"
                  : note.isRead
                  ? "border-gray-200/80 bg-white shadow-xs hover:border-gray-300 hover:shadow-md"
                  : "border-rose-200/90 bg-linear-to-b from-rose-50/30 via-white to-white shadow-xs hover:border-rose-300 hover:shadow-md ring-1 ring-rose-300/30"
              }`}
            >
              {/* Decorative Stamp (Top Right) */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-dashed border-rose-300/60 bg-rose-50/80 text-lg shadow-2xs">
                  {note.emoji || "💌"}
                </span>
              </div>

              {/* Card Header & Sender */}
              <div className="p-5 pb-3">
                <div className="flex items-center gap-3 pr-12">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    <img
                      src={note.senderImage || "/default-avatar.png"}
                      alt={note.senderName || "Sender"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-xs font-bold text-gray-900">
                      {note.senderName || "Special Friend"}
                    </h4>
                    <p className="truncate text-[10px] text-gray-500">{note.senderEmail}</p>
                  </div>
                </div>

                {/* Tag & Recipient */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-rose-100/70 border border-rose-200/60 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                    {note.tag || "Sweet Wish"}
                  </span>
                  <span className="rounded-full bg-purple-50 border border-purple-200/50 px-2.5 py-0.5 text-[10px] font-semibold text-purple-700">
                    To: RayHan & Afrin 💖
                  </span>
                  {!note.isRead && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700">
                      New
                    </span>
                  )}
                </div>

                {/* Title & Message */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="font-serif text-sm font-bold text-gray-900 leading-snug">
                    {note.title}
                  </h3>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-gray-600 font-normal">
                    {note.message}
                  </p>
                </div>
              </div>

              {/* Card Footer: Timestamp & Actions */}
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatDate(note.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Toggle Read */}
                  <button
                    type="button"
                    onClick={() => handleToggleRead(note)}
                    title={note.isRead ? "Mark as Unread" : "Mark as Read"}
                    className={`grid h-7 w-7 place-items-center rounded-lg transition cursor-pointer ${
                      note.isRead
                        ? "text-gray-400 hover:bg-gray-200/60 hover:text-gray-700"
                        : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {note.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Toggle Favorite (Rayhan only can toggle favorite as requested) */}
                  {isRayhan && (
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(note)}
                      title={note.isFavorite ? "Remove from Favorites" : "Star Favorite"}
                      className={`grid h-7 w-7 place-items-center rounded-lg transition cursor-pointer ${
                        note.isFavorite
                          ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                          : "text-gray-400 hover:bg-gray-200/60 hover:text-amber-500"
                      }`}
                    >
                      <Star
                        size={14}
                        fill={note.isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  )}

                  {/* Delete (Rayhan only can delete notes) */}
                  {isRayhan && (
                    <button
                      type="button"
                      onClick={() => confirmDelete(note)}
                      title="Delete Note"
                      className="grid h-7 w-7 place-items-center rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirmation Modal (Rayhan only) ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-6 shadow-xl text-center space-y-4">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-gray-900">Delete Sweet Note?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to permanently delete the note from{" "}
                <strong className="text-gray-800">{noteToDelete?.senderName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
