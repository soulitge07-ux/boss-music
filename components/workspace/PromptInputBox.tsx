"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowUp,
  Square,
  X,
  StopCircle,
  Mic,
  FileText,
  Timer,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
        className
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// ── Tooltip ───────────────────────────────────────────────────────────────────
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ── Dialog ────────────────────────────────────────────────────────────────────
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[560px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#333333] bg-[#1F2023] p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-all">
        <X className="h-5 w-5 text-gray-200 hover:text-white" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-100",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white hover:bg-white/80 text-black",
      outline: "border border-[#444444] bg-transparent hover:bg-[#3A3A40]",
      ghost: "bg-transparent hover:bg-[#3A3A40]",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6",
      icon: "h-8 w-8 rounded-full aspect-[1/1]",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ── VoiceRecorder ─────────────────────────────────────────────────────────────
interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (duration: number) => void;
  visualizerBars?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  visualizerBars = 32,
}) => {
  const [time, setTime] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      onStartRecording();
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      onStopRecording(time);
      setTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full transition-all duration-300 py-3",
        isRecording ? "opacity-100" : "opacity-0 h-0"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-sm text-white/80">{formatTime(time)}</span>
      </div>
      <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full bg-white/50 animate-pulse"
            style={{
              height: `${Math.max(15, Math.random() * 100)}%`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── PromptInput context ───────────────────────────────────────────────────────
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});
function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error("usePromptInput must be used within a PromptInput");
  return context;
}

// ── PromptInput wrapper ───────────────────────────────────────────────────────
interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      className,
      isLoading = false,
      maxHeight = 240,
      value,
      onValueChange,
      onSubmit,
      children,
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{
            isLoading,
            value: value ?? internalValue,
            setValue: onValueChange ?? handleChange,
            maxHeight,
            onSubmit,
            disabled,
          }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
              isLoading && "border-red-500/70",
              className
            )}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = "PromptInput";

// ── PromptInputTextarea ───────────────────────────────────────────────────────
interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}
const PromptInputTextarea: React.FC<
  PromptInputTextareaProps & React.ComponentProps<typeof Textarea>
> = ({ className, onKeyDown, disableAutosize = false, placeholder, ...props }) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

// ── PromptInputActions / Action ───────────────────────────────────────────────
const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

// ── CustomDivider ─────────────────────────────────────────────────────────────
const CustomDivider: React.FC = () => (
  <div className="relative h-6 w-[1.5px] mx-1">
    <div
      className="absolute inset-0 bg-gradient-to-t from-transparent via-[#9b87f5]/70 to-transparent rounded-full"
      style={{
        clipPath:
          "polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)",
      }}
    />
  </div>
);

// ── Duration helpers ──────────────────────────────────────────────────────────
const DURATION_OPTIONS = [
  { label: "3s", value: 3 },
  { label: "15s", value: 15 },
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
];

function formatDuration(s: number) {
  const opt = DURATION_OPTIONS.find((o) => o.value === s);
  if (opt) return opt.label;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)} min`;
}

// ── PromptInputBox (main export) ──────────────────────────────────────────────
export interface MusicGenOptions {
  lyrics: string;
  duration: number;
  batchSize: number;
}

interface PromptInputBoxProps {
  onSend?: (message: string, options: MusicGenOptions) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptInputBox = React.forwardRef(
  (props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      onSend = () => {},
      isLoading = false,
      placeholder = "Describe the music you want to generate...",
      className,
    } = props;

    const [input, setInput] = React.useState("");
    const [isRecording, setIsRecording] = React.useState(false);

    // Options
    const [lyrics, setLyrics] = React.useState("");
    const [lyricsModalOpen, setLyricsModalOpen] = React.useState(false);
    const [lyricsDraft, setLyricsDraft] = React.useState("");
    const [duration, setDuration] = React.useState(60);
    const [durationOpen, setDurationOpen] = React.useState(false);
    const [batchSize, setBatchSize] = React.useState(1);
    const [batchOpen, setBatchOpen] = React.useState(false);

    const promptBoxRef = React.useRef<HTMLDivElement>(null);
    const durationRef = React.useRef<HTMLDivElement>(null);
    const batchRef = React.useRef<HTMLDivElement>(null);

    // Close popovers on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
          setDurationOpen(false);
        }
        if (batchRef.current && !batchRef.current.contains(e.target as Node)) {
          setBatchOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSubmit = () => {
      if (!input.trim()) return;
      onSend(input, { lyrics, duration, batchSize });
      setInput("");
    };

    const handleStartRecording = () => {};
    const handleStopRecording = (dur: number) => {
      setIsRecording(false);
      onSend(`[Voice message - ${dur} seconds]`, { lyrics, duration, batchSize });
    };

    const hasContent = input.trim() !== "";
    const lyricsActive = lyrics.trim() !== "";
    const durationNonDefault = duration !== 60;
    const batchNonDefault = batchSize > 1;

    return (
      <>
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className={cn(
            "w-full bg-[#1F2023] border-[#444444] shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300 ease-in-out",
            isRecording && "border-red-500/70",
            className
          )}
          disabled={isLoading || isRecording}
          ref={ref ?? promptBoxRef}
        >
          {/* Textarea */}
          <div
            className={cn(
              "transition-all duration-300",
              isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
            )}
          >
            <PromptInputTextarea
              placeholder={placeholder}
              className="text-base"
            />
          </div>

          {/* Voice recorder */}
          {isRecording && (
            <VoiceRecorder
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          )}

          {/* Bottom action bar */}
          <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
            {/* Left tools */}
            <div
              className={cn(
                "flex items-center gap-1 transition-opacity duration-300",
                isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible"
              )}
            >
              {/* Lyrics */}
              <button
                type="button"
                onClick={() => {
                  setLyricsDraft(lyrics);
                  setLyricsModalOpen(true);
                }}
                className={cn(
                  "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                  lyricsActive
                    ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]"
                    : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                )}
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {lyricsActive && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs overflow-hidden whitespace-nowrap flex-shrink-0"
                    >
                      Lyrics
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <CustomDivider />

              {/* Duration */}
              <div ref={durationRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDurationOpen((p) => !p);
                    setBatchOpen(false);
                  }}
                  className={cn(
                    "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                    durationNonDefault
                      ? "bg-[#F97316]/15 border-[#F97316] text-[#F97316]"
                      : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <Timer className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">
                    {formatDuration(duration)}
                  </span>
                </button>

                <AnimatePresence>
                  {durationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 left-0 z-50 flex gap-1 p-1.5 rounded-xl border border-[#333] bg-[#1A1B1E] shadow-xl"
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setDuration(opt.value);
                            setDurationOpen(false);
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                            duration === opt.value
                              ? "bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/40"
                              : "text-[#9CA3AF] hover:text-white hover:bg-white/5 border border-transparent"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <CustomDivider />

              {/* Batch size */}
              <div ref={batchRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setBatchOpen((p) => !p);
                    setDurationOpen(false);
                  }}
                  className={cn(
                    "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                    batchNonDefault
                      ? "bg-[#1EAEDB]/15 border-[#1EAEDB] text-[#1EAEDB]"
                      : "bg-transparent border-transparent text-[#9CA3AF] hover:text-[#D1D5DB]"
                  )}
                >
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">×{batchSize}</span>
                </button>

                <AnimatePresence>
                  {batchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 left-0 z-50 flex gap-1 p-1.5 rounded-xl border border-[#333] bg-[#1A1B1E] shadow-xl"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          onClick={() => {
                            setBatchSize(n);
                            setBatchOpen(false);
                          }}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                            batchSize === n
                              ? "bg-[#1EAEDB]/20 text-[#1EAEDB] border border-[#1EAEDB]/40"
                              : "text-[#9CA3AF] hover:text-white hover:bg-white/5 border border-transparent"
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: send / mic / stop */}
            <PromptInputAction
              tooltip={
                isLoading
                  ? "Stop generation"
                  : isRecording
                  ? "Stop recording"
                  : hasContent
                  ? "Send message"
                  : "Voice message"
              }
            >
              <Button
                variant="default"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-200",
                  isRecording
                    ? "bg-transparent hover:bg-gray-600/30 text-red-500 hover:text-red-400"
                    : hasContent
                    ? "bg-white hover:bg-white/80 text-[#1F2023]"
                    : "bg-transparent hover:bg-gray-600/30 text-[#9CA3AF] hover:text-[#D1D5DB]"
                )}
                onClick={() => {
                  if (isRecording) setIsRecording(false);
                  else if (hasContent) handleSubmit();
                  else setIsRecording(true);
                }}
                disabled={isLoading && !hasContent}
              >
                {isLoading ? (
                  <Square className="h-4 w-4 fill-[#1F2023] animate-pulse" />
                ) : isRecording ? (
                  <StopCircle className="h-5 w-5 text-red-500" />
                ) : hasContent ? (
                  <ArrowUp className="h-4 w-4 text-[#1F2023]" />
                ) : (
                  <Mic className="h-5 w-5 transition-colors" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>

        {/* Lyrics modal */}
        <Dialog open={lyricsModalOpen} onOpenChange={setLyricsModalOpen}>
          <DialogContent>
            <div className="p-6 pt-5">
              <DialogTitle className="mb-1">Lyrics</DialogTitle>
              <p className="text-xs text-gray-500 mb-4">
                Add optional lyrics. Use tags like{" "}
                <span className="text-gray-400">[Verse]</span>,{" "}
                <span className="text-gray-400">[Chorus]</span>,{" "}
                <span className="text-gray-400">[Bridge]</span>.
              </p>
              <textarea
                value={lyricsDraft}
                onChange={(e) => setLyricsDraft(e.target.value)}
                rows={10}
                className="w-full bg-[#2A2B30] border border-[#3A3B40] focus:border-[#555] rounded-xl p-3 text-sm text-gray-200 resize-none focus:outline-none transition-colors"
                placeholder={"[Verse]\nYour lyrics here...\n\n[Chorus]\nChorus lyrics..."}
                style={{ fontFamily: "var(--font-geist-mono)" }}
              />
              <div className="flex justify-end gap-2 mt-4">
                {lyrics && (
                  <button
                    onClick={() => {
                      setLyrics("");
                      setLyricsDraft("");
                      setLyricsModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setLyricsModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-[#3A3B40] hover:border-[#555] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setLyrics(lyricsDraft);
                    setLyricsModalOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#8B5CF6]/20 text-[#a78bfa] border border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/30 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);
PromptInputBox.displayName = "PromptInputBox";
