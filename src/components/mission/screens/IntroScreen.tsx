import ScreenWrapper from "@/components/mission/ScreenWrapper";
import MissionButton from "@/components/mission/MissionButton";
import { useTranslation } from "react-i18next";

interface IntroScreenProps {
  onNext: () => void;
  onHistory: () => void;
}

const IntroScreen = ({ onNext, onHistory }: IntroScreenProps) => {
  const { t } = useTranslation();

  return (
    <ScreenWrapper screenKey="intro">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <h1 className="text-[22px] font-heading text-foreground text-center">
          {t("mission.intro_title")}
        </h1>

        <div className="space-y-5 text-[15px] font-body text-muted-foreground leading-[1.65] text-center">
          <p>
            {t("mission.intro_p1")}
          </p>
          <p>
            {t("mission.intro_p2")}
          </p>
          <p className="text-foreground/80 italic">{t("mission.intro_breath")}</p>
          <p>{t("mission.intro_no_wrong")}</p>
        </div>
      </div>

      <div className="pt-8 pb-4 space-y-3">
        <MissionButton onClick={onNext}>{t("mission.intro_begin")}</MissionButton>
        <MissionButton variant="outline" onClick={onHistory}>
          {t("mission.intro_past_reflections")}
        </MissionButton>
      </div>
    </ScreenWrapper>
  );
};

export default IntroScreen;
