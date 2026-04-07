import { useState } from "react";
import ScreenWrapper from "@/components/mission/ScreenWrapper";
import MissionButton from "@/components/mission/MissionButton";
import ValueChip from "@/components/mission/ValueChip";
import { useTranslation } from "react-i18next";

const VALUES = [
  { key: "value_kindness", label: "Kindness" },
  { key: "value_peace", label: "Peace" },
  { key: "value_connection", label: "Connection" },
  { key: "value_honesty", label: "Honesty" },
  { key: "value_patience", label: "Patience" },
  { key: "value_courage", label: "Courage" },
  { key: "value_self_compassion", label: "Self-compassion" },
  { key: "value_gratitude", label: "Gratitude" },
  { key: "value_creativity", label: "Creativity" },
  { key: "value_growth", label: "Growth" },
  { key: "value_rest", label: "Rest" },
  { key: "value_love", label: "Love" },
  { key: "value_simplicity", label: "Simplicity" },
  { key: "value_freedom", label: "Freedom" },
  { key: "value_purpose", label: "Purpose" },
  { key: "value_joy", label: "Joy" },
];

interface ValuesScreenProps {
  selected: string[];
  onSelect: (values: string[]) => void;
  onNext: () => void;
}

const ValuesScreen = ({ selected, onSelect, onNext }: ValuesScreenProps) => {
  const { t } = useTranslation();

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter((v) => v !== value));
    } else if (selected.length < 3) {
      onSelect([...selected, value]);
    }
  };

  return (
    <ScreenWrapper screenKey="values">
      <div className="flex-1 space-y-6">
        <h1 className="text-[22px] font-heading text-foreground text-center">
          {t("mission.values_title")}
        </h1>

        <p className="text-[15px] font-body text-muted-foreground leading-[1.65] text-center">
          {t("mission.values_subtitle")}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {VALUES.map((v) => (
            <ValueChip
              key={v.key}
              label={t(v.key)}
              selected={selected.includes(v.key)}
              onToggle={() => toggle(v.key)}
            />
          ))}
        </div>
      </div>

      <div className="pt-8 pb-4">
        <MissionButton onClick={onNext} disabled={selected.length === 0}>
          {t("mission.values_next")}
        </MissionButton>
      </div>
    </ScreenWrapper>
  );
};

export default ValuesScreen;
