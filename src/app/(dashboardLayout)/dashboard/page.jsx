"use client";

import RayhanDashboard from "@/components/Dashboard/RayhanDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import AfrinDashboard from "@/components/Dashboard/AfrinDashboard";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Droplet, ShieldAlert } from "lucide-react";

export default function DashboardHome() {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center w-14 h-14">
            {/* Smooth backdrop spinning ring */}
            <div className="absolute inset-0 border-4 border-rose-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-rose-600 rounded-full animate-spin" />
            <Droplet
              size={20}
              className="text-rose-600 animate-pulse fill-rose-600/10"
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 animate-pulse mt-2">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={22} />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Authentication Required
          </h3>
          <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
            Your active session context could not be pulled. Please sign in
            again to access your panel matrix.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex w-full items-center justify-center px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm cursor-pointer"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const role = (user.role || "").toLowerCase();

  switch (role) {
    case "user":
      return <UserDashboard />;
    case "rayhan":
      return <RayhanDashboard />;
    case "afrin":
      return <AfrinDashboard />;
    default:
      return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center max-w-sm bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Unrecognized Role Clearance
            </h3>
            <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
              The role configuration parameter assigned to{" "}
              <span className="font-semibold text-gray-700">{user.email}</span>{" "}
              (<code>"{role || "none"}"</code>) does not match system
              permissions directories.
            </p>
          </div>
        </div>
      );
  }
}
