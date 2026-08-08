"use client";
/* scrollbar-fix: overflow-x-hidden on root wrapper */

import React, { useState, useEffect } from "react";
import {
  ShieldUser,
  Trash2,
  UserRound,
  Search,
  RefreshCw,
  Database,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  UserCheck,
  Ban,
  Unlock,
  Heart,
  Crown,
} from "lucide-react";

const ROLES = ["Rayhan", "Afrin", "User"];

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbSource, setDbSource] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch Users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/all-users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setDbSource(data.source || "mongodb");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toast notification trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Change User Role Handler (Rayhan, Afrin, User)
  const handleChangeRole = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/user/all-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast(`User role updated to ${newRole}!`);
      }
    } catch (err) {
      console.error("Error changing role:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle Block / Unblock User Handler
  const handleToggleBlock = async (userId, currentStatus, userName) => {
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    const actionText = newStatus === "Blocked" ? "block" : "unblock";

    if (
      newStatus === "Blocked" &&
      !confirm(`Are you sure Rayhan wants to block "${userName}"? They will not be able to log in again.`)
    ) {
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch("/api/user/all-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        );
        showToast(
          newStatus === "Blocked"
            ? `🚫 "${userName}" has been blocked by Admin Rayhan.`
            : `🟢 "${userName}" has been unblocked.`
        );
      }
    } catch (err) {
      console.error("Error toggling block status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch("/api/user/all-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showToast(`User "${userName}" has been deleted.`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered Users Math
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalCount = users.length;
  const rayhanCount = users.filter((u) => (u.role || "").toLowerCase() === "rayhan").length;
  const afrinCount = users.filter((u) => (u.role || "").toLowerCase() === "afrin").length;
  const blockedCount = users.filter((u) => (u.status || "").toLowerCase() === "blocked").length;

  return (
    <div className="space-y-6 animate-fadeIn min-h-screen w-full overflow-x-hidden">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-rose-500/40 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Registered Orbit Users & Roles
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
              <Database size={12} />
              {dbSource === "mongodb" ? "MongoDB Live" : "Fetched from Database"}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            3 System Roles: <span className="font-bold text-rose-600">Rayhan</span> (Admin),{" "}
            <span className="font-bold text-pink-600">Afrin</span> (VIP Partner), and{" "}
            <span className="font-bold text-slate-700">User</span>. Rayhan can block or unblock users to control login access.
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Database
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{totalCount} Members</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
            <UserRound size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Super Admin
            </p>
            <h3 className="text-xl font-black text-rose-600 mt-1">{rayhanCount} Rayhan</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Crown size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
              Co-Author VIP
            </p>
            <h3 className="text-xl font-black text-pink-600 mt-1">{afrinCount} Afrin</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
            <Heart size={18} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Blocked Accounts
            </p>
            <h3 className="text-xl font-black text-rose-700 mt-1">{blockedCount} Blocked</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200">
            <Ban size={18} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Role Filter Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="All">All Roles</option>
            <option value="Rayhan">Rayhan (Admin)</option>
            <option value="Afrin">Afrin (VIP)</option>
            <option value="User">User</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden w-full">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider animate-pulse">
              Loading users from database...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <UserRound size={32} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No users found</p>
            <p className="text-xs">Try adjusting your search query or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="bg-rose-50/60 text-rose-600 font-bold text-xs uppercase tracking-wider border-b border-rose-100">
                  <th className="p-4 pl-6">User Profile</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Login Status</th>
                  <th className="p-4 text-center">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-slate-700 text-xs">
                {filteredUsers.map((u) => {
                  const isRayhan = u.role === "Rayhan";
                  const isAfrin = u.role === "Afrin";
                  const isBlocked = u.status === "Blocked";

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isBlocked ? "bg-rose-50/40" : "hover:bg-rose-50/20"
                      }`}
                    >
                      {/* Avatar & Name */}
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className={`w-10 h-10 rounded-full border object-cover shrink-0 shadow-xs ${
                              isBlocked ? "border-rose-400 grayscale" : "border-rose-200"
                            }`}
                          />
                          {isBlocked && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                              ✕
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                            {u.name}
                            {isRayhan && <Crown size={12} className="text-amber-500" />}
                            {isAfrin && <Heart size={12} className="text-pink-500 fill-pink-500" />}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Joined {u.createdAt}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 font-medium text-slate-600">{u.email}</td>

                      {/* Role Selector Dropdown */}
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          disabled={actionLoading === u.id}
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border focus:outline-none cursor-pointer ${
                            isRayhan
                              ? "bg-rose-100 text-rose-700 border-rose-200"
                              : isAfrin
                              ? "bg-pink-100 text-pink-700 border-pink-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r} {r === "Rayhan" ? "(Admin)" : r === "Afrin" ? "(VIP)" : ""}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Login Status Badge */}
                      <td className="p-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                            <Ban size={12} />
                            Blocked (No Access)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions: Block/Unblock & Delete */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Block / Unblock Toggle Button */}
                          <button
                            onClick={() => handleToggleBlock(u.id, u.status, u.name)}
                            disabled={actionLoading === u.id || isRayhan}
                            className={`px-3 py-1 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isBlocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs"
                                : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                            title={isRayhan ? "Rayhan Admin cannot be blocked" : ""}
                          >
                            {isBlocked ? (
                              <>
                                <Unlock size={13} /> Unblock
                              </>
                            ) : (
                              <>
                                <Ban size={13} /> Block
                              </>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={actionLoading === u.id || isRayhan}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}