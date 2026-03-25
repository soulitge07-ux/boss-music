"use client";

const LETTERS = "Generating".split("");

export default function GeneratingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3">
      {/* Animated letters */}
      <div
        className="flex items-baseline gap-[1px]"
        style={{ fontFamily: "var(--font-ubuntu)" }}
      >
        {LETTERS.map((letter, idx) => (
          <span
            key={idx}
            className="inline-block text-lg font-black tracking-tighter text-white opacity-0"
            style={{
              animation: "letterAnim 3s linear infinite",
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Sweeping line */}
      <div
        className="relative w-40 h-px overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="absolute inset-y-0 w-16 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            animation: "lineSweep 1.6s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
