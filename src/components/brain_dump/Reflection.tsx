import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  onComplete: (reflection: string) => void;
  onBack: () => void;
}

const feelings = [
  { label: "Slightly lighter", emoji: "🌤" },
  { label: "More focused", emoji: "🎯" },
  { label: "About the same", emoji: "🌊" },
  { label: "Still overwhelmed", emoji: "💙" },
];

export const Reflection = ({ onComplete, onBack }: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("brain_dump.reflection_title")}</h1>
        <p className="text-muted-foreground text-sm mb-10">{t("brain_dump.reflection_desc")}</p>
      </div>

      <div className="flex flex-col gap-3 w-full mb-8">
        {feelings.map((f) => (
          <button
            key={f.label}
            onClick={() => setSelected(f.label)}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 animate-fade-in ${selected === f.label
                ? "border-primary bg-accent shadow-soft"
                : "border-border bg-card/80 hover:border-primary/30"
              }`}
            style={{ animationDelay: `${feelings.indexOf(f) * 0.1}s` }}
          >
            <span className="text-xl">{f.emoji}</span>
            <span className="text-sm text-foreground font-medium">{f.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="text-center animate-fade-in mb-8">
          <p className="text-foreground/80 text-sm leading-relaxed max-w-xs mx-auto">
            Even small steps reduce mental weight. You don't have to carry everything at once.
          </p>
        </div>
      )}

      {selected && (
        <button
          onClick={() => onComplete(selected)}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-soft active:scale-[0.98] animate-fade-in mb-8"
        >
          {t("brain_dump.finish_session")}
        </button>
      )}

      {/* Support message */}
      <div className="mt-auto pt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <p className="text-xs text-muted-foreground/70 text-center leading-relaxed max-w-xs mx-auto">
          🌸 If your thoughts feel constant or overwhelming, consider reaching out to someone you trust or a mental health professional.
        </p>
      </div>
    </div>
  );
};
