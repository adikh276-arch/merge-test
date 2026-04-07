import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ThoughtItem } from "./BrainDumpApp";

interface Props {
  thoughts: ThoughtItem[];
  onComplete: () => void;
  onBack: () => void;
}

const rotatingTexts = ["Just this step.", "Stay present.", "One thing at a time."];

export const OneSmallStep = ({ thoughts, onComplete, onBack }: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [nextStep, setNextStep] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [textIndex, setTextIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedItem = thoughts.find((t) => t.id === selected);

  // Timer
  useEffect(() => {
    if (focusMode && !paused && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(intervalRef.current!);
    }
    if (timeLeft === 0) onComplete();
  }, [focusMode, paused, timeLeft]);

  // Rotating text
  useEffect(() => {
    if (!focusMode) return;
    const t = setInterval(() => setTextIndex((i) => (i + 1) % rotatingTexts.length), 4000);
    return () => clearInterval(t);
  }, [focusMode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / 180;
  const circumference = 2 * Math.PI * 54;

  const placeholders = ["Open the document", "Put clothes in washer", "Send 'Hey'", "Tidy one corner"];

  if (focusMode) {
    return (
      <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col items-center justify-center">
        {/* Timer ring */}
        <div className="relative mb-10">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress * circumference}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          {/* Breathing center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 animate-breathe" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-foreground tabular-nums">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Rotating text */}
        <p key={textIndex} className="text-muted-foreground text-center text-sm animate-rotate-text mb-12">
          {rotatingTexts[textIndex]}
        </p>

        {/* Controls */}
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex-1 py-3 rounded-lg bg-muted text-foreground font-medium transition-all duration-300 hover:shadow-soft"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-soft"
          >
            Go to Reflection →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{t("brain_dump.small_step_title")}</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-6 ml-11">
        {t("brain_dump.small_step_desc")}
      </p>

      {/* Action items */}
      {thoughts.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No action items were sorted. You can go back to add some, or move to reflection.
        </p>
      ) : (
        <>
          <p className="text-foreground/80 text-sm mb-4">Choose ONE thing to focus on right now.</p>
          <div className="flex flex-col gap-3 mb-6">
            {thoughts.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-300 ${selected === t.id
                    ? "border-primary bg-accent shadow-soft"
                    : "border-border bg-card hover:border-primary/30"
                  }`}
              >
                <span className="text-sm text-foreground">{t.text}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Selected expansion */}
      {selectedItem && (
        <div className="animate-fade-in mb-6">
          <p className="text-foreground/80 text-sm mb-3">{t("brain_dump.first_step_placeholder")}</p>
          <input
            type="text"
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
            className="w-full p-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:glow-border transition-shadow duration-500 text-sm"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="mt-auto flex flex-col gap-3">
        {selectedItem && (
          <button
            onClick={() => setFocusMode(true)}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
          >
            Start 3-Minute Focus
          </button>
        )}
        {thoughts.length === 0 && (
          <button
            onClick={onComplete}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
          >
            Go to Reflection →
          </button>
        )}
      </div>
    </div>
  );
};
