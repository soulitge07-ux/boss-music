"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setPopoverOpen(false), 120);
  };

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";

  return (
    <nav
      className="w-full flex items-center px-6 py-3 gap-4"
      style={{ background: "transparent" }}
    >
      {/* ── Left: Logo ── */}
      <div className="flex-none" style={{ fontFamily: "var(--font-ubuntu)" }}>
        <span className="text-sm font-black tracking-tighter text-white select-none">
          BOSS <span className="text-gray-500">MUSIC</span>
        </span>
      </div>

      {/* ── Center: Search ── */}
      <div className="flex-1 flex justify-center">
        <div
          className="relative flex items-center w-full max-w-md rounded-2xl px-4 py-2.5 gap-3 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.25)",
          }}
        >
          {/* top highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-4 right-4 h-px rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />

          {/* Search icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="flex-none opacity-30"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none caret-gray-400"
            style={{ fontFamily: "var(--font-ubuntu)" }}
          />
        </div>
      </div>

      {/* ── Right: Profile popover ── */}
      <div className="flex-none relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Avatar trigger */}
        <button
          className="relative flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 34,
            height: 34,
            padding: 2,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-300 font-medium" style={{ fontFamily: "var(--font-ubuntu)" }}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {/* Popover */}
        <div
          className="absolute right-0 top-full mt-2 min-w-[180px] rounded-2xl p-px transition-all duration-200 origin-top-right"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)",
            opacity: popoverOpen ? 1 : 0,
            transform: popoverOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(-6px)",
            pointerEvents: popoverOpen ? "auto" : "none",
            zIndex: 50,
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(30,30,30,0.85) 0%, rgba(20,20,20,0.92) 100%)",
              backdropFilter: "blur(32px) saturate(200%)",
              WebkitBackdropFilter: "blur(32px) saturate(200%)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Inner top highlight */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              }}
            />

            {/* User info */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="profile" className="w-8 h-8 rounded-full flex-none" />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-none"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <span className="text-xs text-gray-300" style={{ fontFamily: "var(--font-ubuntu)" }}>
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p
                  className="text-xs font-medium text-white truncate"
                  style={{ fontFamily: "var(--font-ubuntu)" }}
                >
                  {(user?.user_metadata?.full_name as string | undefined) ?? ""}
                </p>
                <p
                  className="text-xs text-gray-500 truncate"
                  style={{ fontFamily: "var(--font-ubuntu)" }}
                >
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div
              className="mx-4"
              style={{ height: 1, background: "rgba(255,255,255,0.06)" }}
            />

            {/* Sign out */}
            <div className="p-2">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 transition-all duration-150 hover:text-white group"
                style={{ fontFamily: "var(--font-ubuntu)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="flex-none opacity-60">
                  <path
                    d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
