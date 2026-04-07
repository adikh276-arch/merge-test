import { Sparkles, Brain, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  onStart: () => void;
}

export const Welcome = ({ onStart }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col justify-center">
      <div className="animate-fade-in">
        {/* Headline */}
        <h1 className="text-3xl font-bold text-foreground mb-3 text-center">
          {t("brain_dump.welcome_title")}
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-center mb-8">
          {t("brain_dump.welcome_subtitle")}
        </p>

        {/* Body copy */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-soft">
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            {t("brain_dump.welcome_desc")}
          </p>
          <div className="space-y-1 text-foreground/70 text-sm italic">
          </div>
        </div>

        {/* Steps preview */}
        <div className="mb-10">
          <p className="text-foreground/80 text-sm mb-4">{t("brain_dump.how_it_works")}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">{t("brain_dump.step_1")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">{t("brain_dump.step_2")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles size={18} className="text-primary" />
              </div>
              <span className="text-sm text-foreground/80">{t("brain_dump.step_3")}</span>
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-base transition-all duration-300 hover:shadow-soft active:scale-[0.98]"
        >
          {t("brain_dump.start_dump")}
        </button>
      </div>
    </div>
  );
};
