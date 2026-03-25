"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MusicRow, MusicType } from "@/types/database";
import { MoreHorizontal, Pencil, Trash2, Download } from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── MusicCard ─────────────────────────────────────────────────────────────────
function MusicCard({
  music,
  onDelete,
  onRename,
}: {
  music: MusicRow;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(music.title ?? "");
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Resolve signed URL once completed
  useEffect(() => {
    if (music.status !== "completed" || !music.file_path) return;
    if (music.file_path.startsWith("http")) {
      setAudioUrl(music.file_path);
      return;
    }
    const supabase = createClient();
    supabase.storage
      .from("musics")
      .createSignedUrl(music.file_path, 3600)
      .then(({ data }) => {
        if (data?.signedUrl) setAudioUrl(data.signedUrl);
      });
  }, [music.status, music.file_path]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (isRenaming) {
      setRenameValue(music.title ?? "");
      setTimeout(() => renameInputRef.current?.focus(), 50);
    }
  }, [isRenaming, music.title]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration) setProgress((currentTime / duration) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
  };

  const handleRenameSubmit = () => {
    setIsRenaming(false);
    const trimmed = renameValue.trim();
    onRename(music.id, trimmed);
  };

  const handleDownload = async () => {
    setMenuOpen(false);
    if (!audioUrl) return;
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${music.title || music.prompt.slice(0, 40)}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("[MusicCard] download error:", e);
    }
  };

  const isProcessing = music.status === "processing";
  const isFailed = music.status === "failed";
  const isCompleted = music.status === "completed";

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: isFailed
          ? "1px solid rgba(239,68,68,0.15)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Top row: badges + time + menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Type badge */}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={
              music.type === "music"
                ? {
                    background: "rgba(139,92,246,0.15)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }
                : {
                    background: "rgba(249,115,22,0.15)",
                    color: "#fb923c",
                    border: "1px solid rgba(249,115,22,0.3)",
                  }
            }
          >
            {music.type === "music" ? "Music" : "SFX"}
          </span>

          {/* Status badge */}
          {isProcessing && (
            <span className="flex items-center gap-1.5 text-[10px] text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Generating…
            </span>
          )}
          {isFailed && (
            <span className="text-[10px] text-red-400">Failed</span>
          )}
          {isCompleted && music.duration && (
            <span className="text-[10px] text-gray-600">{music.duration}s</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-700">
            {music.created_at ? timeAgo(music.created_at) : ""}
          </span>

          {/* Three-dot menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="flex items-center justify-center w-6 h-6 rounded-full transition-all duration-150"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.2)")
              }
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 z-50 flex flex-col py-1 rounded-xl shadow-xl overflow-hidden"
                style={{
                  background: "#1A1B1E",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minWidth: "120px",
                }}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setIsRenaming(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <Pencil className="w-3 h-3" />
                  Rename
                </button>
                {isCompleted && audioUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
                <div
                  className="h-px mx-2 my-1"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(music.id);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline rename input */}
      {isRenaming && (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRenameSubmit();
            if (e.key === "Escape") setIsRenaming(false);
          }}
          onBlur={handleRenameSubmit}
          placeholder="Enter a name…"
          className="w-full bg-transparent border-b text-sm text-white placeholder-gray-600 focus:outline-none pb-0.5 transition-colors"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        />
      )}

      {/* Title (when set and not renaming) */}
      {!isRenaming && music.title && (
        <p
          className="text-sm font-medium text-white/80 leading-none"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          {music.title}
        </p>
      )}

      {/* Prompt */}
      <p
        className="text-sm text-gray-400 leading-relaxed line-clamp-2"
        style={{ fontFamily: "var(--font-ubuntu)" }}
      >
        {music.prompt}
      </p>

      {/* Audio player */}
      {isCompleted && audioUrl && (
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.14)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.08)")
            }
          >
            {isPlaying ? (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <rect x="0" y="0" width="3.5" height="12" rx="1" fill="white" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="1" fill="white" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M0 0L10 6L0 12V0Z" fill="white" />
              </svg>
            )}
          </button>

          <div
            className="flex-1 h-1 rounded-full cursor-pointer overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background:
                  music.type === "music"
                    ? "rgba(139,92,246,0.8)"
                    : "rgba(249,115,22,0.8)",
              }}
            />
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="hidden"
          />
        </div>
      )}

      {/* Processing skeleton */}
      {isProcessing && (
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full w-1/2 rounded-full animate-pulse"
            style={{ background: "rgba(59,130,246,0.4)" }}
          />
        </div>
      )}
    </div>
  );
}

// ── MusicList ─────────────────────────────────────────────────────────────────
interface MusicListProps {
  refreshKey: number;
}

type FilterType = "all" | MusicType;

export default function MusicList({ refreshKey }: MusicListProps) {
  const [musics, setMusics] = useState<MusicRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("musics")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setMusics(data);
      });
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    setMusics((prev) => prev.filter((m) => m.id !== id));
    const supabase = createClient();
    const { error } = await supabase.from("musics").delete().eq("id", id);
    if (error) {
      console.error("[MusicList] delete error:", error.message);
      supabase
        .from("musics")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setMusics(data); });
    }
  };

  const handleRename = async (id: string, title: string) => {
    setMusics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, title: title || null } : m))
    );
    const supabase = createClient();
    await supabase
      .from("musics")
      .update({ title: title || null })
      .eq("id", id);
  };

  const filtered =
    filter === "all" ? musics : musics.filter((m) => m.type === filter);

  const tabs: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Music", value: "music" },
    { label: "SFX", value: "sfx" },
  ];

  if (musics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18V5l12-2v13"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="18" r="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <circle cx="18" cy="16" r="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          </svg>
        </div>
        <p
          className="text-sm text-gray-700"
          style={{ fontFamily: "var(--font-ubuntu)" }}
        >
          Describe music or a sound effect to generate
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl self-start"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150"
            style={
              filter === tab.value
                ? {
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    fontFamily: "var(--font-ubuntu)",
                  }
                : {
                    background: "transparent",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-ubuntu)",
                  }
            }
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-1.5 opacity-50">
                {musics.filter((m) => m.type === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {filtered.map((music) => (
          <MusicCard
            key={music.id}
            music={music}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
}
