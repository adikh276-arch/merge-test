import { ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ThoughtItem } from "./BrainDumpApp";

interface SavedSession {
  id: string;
  date: string;
  thoughts: ThoughtItem[];
  reflection?: string;
}

interface Props {
  sessions: SavedSession[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

export const SavedThoughts = ({ sessions, onBack, onDelete }: Props) => {
  const { t } = useTranslation();

  const bucketLabels: Record<string, { emoji: string; label: string; colorClass: string }> = {
    action: { emoji: "🟢", label: t("brain_dump.action_needed"), colorClass: "bg-calm-green/20 border-calm-green" },
    later: { emoji: "🟡", label: t("brain_dump.do_later"), colorClass: "bg-calm-yellow/20 border-calm-yellow" },
    letgo: { emoji: "🔵", label: t("brain_dump.let_it_go"), colorClass: "bg-calm-blue/20 border-calm-blue" },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("brain_dump.history")}</h1>
          <p className="text-muted-foreground text-sm">{t("brain_dump.no_sessions").split('.')[0]}</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            {t("brain_dump.no_sessions")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-card rounded-xl p-4 shadow-card animate-fade-in"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  {formatDate(session.date)}
                </span>
                <button
                  onClick={() => onDelete(session.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Grouped by bucket */}
              {(["action", "later", "letgo"] as const).map((bucket) => {
                const items = session.thoughts.filter((t) => t.bucket === bucket);
                if (items.length === 0) return null;
                const config = bucketLabels[bucket];
                return (
                  <div key={bucket} className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs">{config.emoji}</span>
                      <span className="text-xs font-medium text-foreground/80">{config.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((item) => (
                        <span
                          key={item.id}
                          className={`px-2 py-1 rounded-md text-xs border ${config.colorClass}`}
                        >
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {session.reflection && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{t("brain_dump.reflection")}: </span>
                  <span className="text-xs text-foreground/80">{session.reflection}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export type { SavedSession };
