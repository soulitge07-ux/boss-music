"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { user, signInWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/workspace");
    }
  }, [user, isLoading, router]);

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#171717" }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: 600,
            height: 600,
            top: "-10%",
            left: "-10%",
            background:
              "radial-gradient(circle, #a78bfa 0%, #7c3aed 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            width: 500,
            height: 500,
            bottom: "-10%",
            right: "-5%",
            background:
              "radial-gradient(circle, #38bdf8 0%, #0ea5e9 50%, transparent 70%)",
          }}
        />
      </div>

      {/* Glass card */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)",
        }}
      >
        {/* Inner card */}
        <div
          className="relative rounded-3xl px-8 py-10 flex flex-col items-center gap-6 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* Inner highlight */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />

          {/* Logo */}
          <div className="flex flex-col items-center gap-1" style={{ fontFamily: "var(--font-ubuntu)" }}>
            <span className="text-2xl font-black tracking-tighter text-white">
              BOSS <span className="text-gray-400">MUSIC</span>
            </span>
            <span className="text-xs tracking-widest text-gray-500 uppercase">
              AI Music Generator
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* Heading */}
          <div className="text-center" style={{ fontFamily: "var(--font-ubuntu)" }}>
            <h1 className="text-xl font-semibold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-400">
              Sign in to start generating music
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="group w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-3.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.07)";
            }}
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            <span
              className="text-sm font-medium text-white"
              style={{ fontFamily: "var(--font-ubuntu)" }}
            >
              {isLoading ? "Loading..." : "Continue with Google"}
            </span>
          </button>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-600 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
