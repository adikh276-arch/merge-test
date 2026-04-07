import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onComplete: (text: string) => void;
}

export const BrainDump = ({ onComplete }: Props) => {
  const { t } = useTranslation();
  const [thoughts, setThoughts] = useState<string[]>([""]);
  const maxRows = 50;

  const updateThought = (index: number, value: string) => {
    setThoughts((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const addThought = () => {
    setThoughts((prev) => (prev.length < maxRows ? [...prev, ""] : prev));
  };

  const removeThought = (index: number) => {
    setThoughts((prev) => {
      if (prev.length === 1) return [""];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const isLast = index === thoughts.length - 1;
    if (isLast) {
      addThought();
      requestAnimationFrame(() => {
        const nextInput = document.getElementById(`thought-input-${index + 1}`);
        nextInput?.focus();
      });
    }
  };

  const filledThoughts = thoughts.map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-1">Brain Dump</h1>
        <p className="text-muted-foreground text-sm">{t("brain_dump.dump_hint")}</p>
      </div>

      <div className="flex-1 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col gap-3 mb-4">
          {thoughts.map((thought, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                id={`thought-input-${index}`}
                type="text"
                value={thought}
                onChange={(e) => updateThought(index, e.target.value)}
                onKeyDown={(e) => handleEnter(e, index)}
                placeholder={index === 0 ? t("brain_dump.dump_placeholder") : "..."}
                className="w-full p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:glow-border transition-shadow duration-500 text-sm shadow-card"
              />
              <button
                type="button"
                onClick={() => removeThought(index)}
                className="h-9 w-9 shrink-0 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Delete thought"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addThought}
          className="text-sm text-primary hover:text-primary/80 transition-colors mb-3"
        >
          + {t("brain_dump.keep_going")}
        </button>

        <p className="text-xs text-muted-foreground/80">{t("brain_dump.breathe")}</p>
      </div>

      <button
        onClick={() => filledThoughts.length > 0 && onComplete(filledThoughts.join("\n"))}
        disabled={filledThoughts.length === 0}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base disabled:opacity-40 transition-all duration-300 hover:shadow-soft active:scale-[0.98] animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        {t("brain_dump.finished")}
      </button>
    </div>
  );
};
