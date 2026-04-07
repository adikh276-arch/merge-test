import { useState, useEffect } from "react";
import ScreenWrapper from "@/components/mission/ScreenWrapper";
import MissionButton from "@/components/mission/MissionButton";
import { MissionData } from "@/types/mission";

import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { SavedMission } from "@/components/mission/screens/HistoryScreen";
import { query } from "@/lib/mission/db";

interface MissionScreenProps {
  data: MissionData;
  onEdit: () => void;
  onHome: () => void;
  onChange: (partial: Partial<MissionData>) => void;
}

const MissionScreen = ({ data, onEdit, onHome, onChange }: MissionScreenProps) => {
  const { t } = useTranslation();

  const valuesText = data.values
    .map(v => t(v))
    .join(", ")
    .replace(/, ([^,]*)$/, `${t("mission.mission_and")}$1`) || t("mission.mission_my_values");

  const [statement, setStatement] = useState("");

  useEffect(() => {
    setStatement(
      `${t("mission.mission_i_choose")}${valuesText.toLowerCase()},\n${t("mission.mission_and_to_be")}${data.beingSomeoneWho.toLowerCase()},\n${t("mission.mission_so_my_life")}${data.lifeFeelMore.toLowerCase()}.`
    );
  }, [t, valuesText, data.beingSomeoneWho, data.lifeFeelMore]);

  const handleSave = async () => {
    try {
      const userId = sessionStorage.getItem("user_id");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await query(
        "INSERT INTO missions (user_id, statement, values) VALUES ($1, $2, $3)",
        [userId, statement, data.values]
      );




      toast.success(t("mission.mission_saved"), {
        style: {
          background: "hsl(300, 18%, 95%)",
          color: "hsl(280, 15%, 22%)",
          border: "1px solid hsl(280, 15%, 82%)",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save statement.");
    }
  };

  return (
    <ScreenWrapper screenKey="mission">
      <div className="flex-1 space-y-8">
        <h1 className="text-[22px] font-heading text-foreground text-center">
          {t("mission.mission_title")}
        </h1>

        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="w-full bg-card text-foreground text-[16px] font-body rounded-2xl border border-border px-5 py-5 resize-none placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 leading-[1.7] text-center overflow-hidden"
          style={{ height: 'auto', minHeight: '120px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />

        <div className="space-y-4 text-[15px] font-body text-muted-foreground leading-[1.65] text-center">
          <p>{t("mission.mission_not_rule")}<br />{t("mission.mission_is_reminder")}</p>
          <p>{t("mission.mission_return_whenever")}</p>
        </div>
      </div>

      <div className="pt-8 pb-4 space-y-3">
        <MissionButton onClick={handleSave}>{t("mission.mission_save")}</MissionButton>
        <MissionButton variant="outline" onClick={onEdit}>
          {t("mission.mission_edit")}
        </MissionButton>
        <MissionButton variant="outline" onClick={onHome}>
          {t("mission.mission_go_home")}
        </MissionButton>
      </div>
    </ScreenWrapper>
  );
};

export default MissionScreen;
