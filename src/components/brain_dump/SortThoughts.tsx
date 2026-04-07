import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ThoughtItem } from "./BrainDumpApp";

interface Props {
  thoughts: ThoughtItem[];
  onComplete: (sorted: ThoughtItem[]) => void;
  onBack: () => void;
}

type Bucket = "action" | "later" | "letgo";

export const SortThoughts = ({ thoughts: initial, onComplete, onBack }: Props) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ThoughtItem[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);

  const buckets: { key: Bucket; emoji: string; label: string; desc: string; colorClass: string; bgClass: string }[] = [
    { key: "action", emoji: "🟢", label: t("brain_dump.action_needed"), desc: t("brain_dump.action_desc"), colorClass: "border-calm-green", bgClass: "bg-calm-green/20" },
    { key: "later", emoji: "🟡", label: t("brain_dump.do_later"), desc: t("brain_dump.later_desc"), colorClass: "border-calm-yellow", bgClass: "bg-calm-yellow/20" },
    { key: "letgo", emoji: "🔵", label: t("brain_dump.let_it_go"), desc: t("brain_dump.letgo_desc"), colorClass: "border-calm-blue", bgClass: "bg-calm-blue/20" },
  ];

  const sorted = items.filter((i) => i.bucket);
  const unsorted = items.filter((i) => !i.bucket);
  const progress = items.length > 0 ? sorted.length / items.length : 0;
  const allSorted = unsorted.length === 0 && items.length > 0;

  const assignBucket = (id: string, bucket: Bucket) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, bucket } : i)));
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDrop = (bucket: Bucket) => {
    if (dragId) {
      assignBucket(dragId, bucket);
      setDragId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{t("brain_dump.sort_title")}</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-4 ml-11">{t("brain_dump.sort_desc")}</p>

      {/* Clarity bar */}
      <div className="mb-5 animate-fade-in">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Clarity Level</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Unsorted cards */}
      {unsorted.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          {unsorted.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="px-3 py-2 rounded-lg bg-card shadow-card text-sm text-foreground cursor-grab active:cursor-grabbing hover:shadow-soft transition-all duration-300 select-none"
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Buckets */}
      <div className="flex flex-col gap-4 flex-1">
        {buckets.map((b) => {
          const bucketItems = items.filter((i) => i.bucket === b.key);
          return (
            <div
              key={b.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(b.key)}
              className={`rounded-lg border-2 border-dashed p-4 min-h-[80px] transition-all duration-300 ${b.colorClass} ${b.bgClass}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{b.emoji}</span>
                <span className="font-semibold text-sm text-foreground">{b.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{b.desc}</p>

              {/* Tap to assign on mobile */}
              {unsorted.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {unsorted.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => assignBucket(item.id, b.key)}
                      className="text-xs px-2 py-1 rounded-md bg-card/60 text-muted-foreground hover:bg-card transition-colors"
                    >
                      + {item.text.slice(0, 20)}{item.text.length > 20 ? "…" : ""}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {bucketItems.map((item) => (
                  <span key={item.id} className="px-3 py-1.5 rounded-lg bg-card/80 text-sm text-foreground shadow-sm animate-fade-in">
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete */}
      {allSorted && (
        <div className="mt-6 text-center animate-fade-in">
          <p className="text-foreground font-medium mb-4 animate-gentle-glow inline-block px-4 py-2 rounded-lg">
            ✨
          </p>
          <button
            onClick={() => onComplete(items)}
            className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
          >
            {t("brain_dump.continue")}
          </button>
        </div>
      )}
    </div>
  );
};
