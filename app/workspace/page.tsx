"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/workspace/Navbar";
import { PromptInputBox, type MusicGenOptions } from "@/components/workspace/PromptInputBox";
import MusicList from "@/components/workspace/MusicList";
import GeneratingIndicator from "@/components/workspace/GeneratingIndicator";
import { createClient } from "@/lib/supabase/client";
import type { MusicType } from "@/types/database";

export default function WorkspacePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateType, setGenerateType] = useState<MusicType>("music");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleSend = async (message: string, options: MusicGenOptions) => {
    if (!message.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch("/api/generate-music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          prompt: message,
          type: generateType,
          lyrics: options.lyrics,
          duration: options.duration,
          batchSize: options.batchSize,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error(`[generate-music] API error (${res.status}):`, data);
      }
    } catch (e) {
      console.error("[generate-music] fetch error:", e);
    } finally {
      setIsGenerating(false);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "#171717" }}
    >
      <Navbar />

      {/* Scrollable content — bottom padding clears the fixed prompt area */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-52">
        <div className="max-w-[38rem] mx-auto">
          {isGenerating && <GeneratingIndicator />}
          <MusicList refreshKey={refreshKey} />
        </div>
      </div>

      {/* Fixed bottom: type toggle + prompt */}
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-6 gap-2 pointer-events-none">
        {/* Music / SFX toggle */}
        <div
          className="flex pointer-events-auto rounded-full p-0.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {(["music", "sfx"] as MusicType[]).map((t) => (
            <button
              key={t}
              onClick={() => setGenerateType(t)}
              className="px-4 py-1 rounded-full text-xs font-medium transition-all duration-150 capitalize"
              style={{
                fontFamily: "var(--font-ubuntu)",
                ...(generateType === t
                  ? {
                      background:
                        t === "music"
                          ? "rgba(139,92,246,0.2)"
                          : "rgba(249,115,22,0.2)",
                      color: t === "music" ? "#a78bfa" : "#fb923c",
                      border:
                        t === "music"
                          ? "1px solid rgba(139,92,246,0.4)"
                          : "1px solid rgba(249,115,22,0.4)",
                    }
                  : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid transparent",
                    }),
              }}
            >
              {t === "music" ? "Music" : "SFX"}
            </button>
          ))}
        </div>

        {/* Prompt input */}
        <div className="w-full max-w-[38rem] pointer-events-auto">
          <PromptInputBox onSend={handleSend} isLoading={isGenerating} />
        </div>
      </div>
    </main>
  );
}
