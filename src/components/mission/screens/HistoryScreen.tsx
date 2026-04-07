import { useState, useEffect } from "react";
import ScreenWrapper from "@/components/mission/ScreenWrapper";
import MissionButton from "@/components/mission/MissionButton";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { query } from "@/lib/mission/db";

export interface SavedMission {
    id: string;
    statement: string;
    values: string[];
    date: string;
}

interface HistoryScreenProps {
    onBack: () => void;
}

const HistoryScreen = ({ onBack }: HistoryScreenProps) => {
    const { t, i18n } = useTranslation();
    const [missions, setMissions] = useState<SavedMission[]>([]);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const userId = sessionStorage.getItem("user_id");
                if (!userId) return;

                const results = await query(
                    "SELECT id, statement, values, created_at AS date FROM missions WHERE user_id = $1 ORDER BY created_at DESC",
                    [userId]
                );
                setMissions(results);
            } catch (err) {
                console.error("Failed to fetch missions", err);
            }
        };
        fetchMissions();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const userId = sessionStorage.getItem("user_id");
            if (!userId) return;

            setMissions((prev) => prev.filter((m) => m.id !== id));
            await query("DELETE FROM missions WHERE id = $1 AND user_id = $2", [id, userId]);
        } catch (err) {
            console.error("Failed to delete mission", err);
        }
    };

    return (
        <ScreenWrapper screenKey="history">
            <div className="flex-1 space-y-8">
                <h1 className="text-[22px] font-heading text-foreground text-center">
                    {t("mission.history_title")}
                </h1>

                {missions.length === 0 ? (
                    <div className="space-y-4 text-center">
                        <p className="text-[15px] font-body text-muted-foreground leading-[1.65]">
                            {t("mission.history_empty")}
                        </p>
                        <p className="text-[15px] font-body text-muted-foreground leading-[1.65] italic">
                            {t("mission.history_empty_hint")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {missions.map((mission) => (
                            <div
                                key={mission.id}
                                className="bg-card rounded-2xl border border-border p-5 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-[13px] font-body text-muted-foreground">
                                        {new Date(mission.date).toLocaleDateString(i18n.language, {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <button
                                        onClick={() => handleDelete(mission.id)}
                                        className="text-muted-foreground/60 hover:text-destructive transition-colors p-1 -mt-1 -mr-1"
                                        aria-label={t("mission.history_delete_aria")}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {mission.values.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {mission.values.map((v) => (
                                            <span
                                                key={v}
                                                className="text-[12px] font-body bg-primary/15 text-primary px-3 py-1 rounded-full"
                                            >
                                                {t(v)}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-[15px] font-body text-foreground leading-[1.7] text-center whitespace-pre-line">
                                    {mission.statement}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-8 pb-4">
                <MissionButton variant="outline" onClick={onBack}>
                    {t("mission.history_back")}
                </MissionButton>
            </div>
        </ScreenWrapper>
    );
};

export default HistoryScreen;
