"use client";

import { useState } from "react";
import IntroScreen from "@/components/mission/screens/IntroScreen";
import ValuesScreen from "@/components/mission/screens/ValuesScreen";
import ReflectionScreen from "@/components/mission/screens/ReflectionScreen";
import MissionScreen from "@/components/mission/screens/MissionScreen";
import HistoryScreen from "@/components/mission/screens/HistoryScreen";

import { MissionData } from "@/types/mission";


export default function MissionStatementPage() {
  const [screen, setScreen] = useState(0);
  const [data, setData] = useState<MissionData>({
    values: [],
    beingSomeoneWho: "",
    lifeFeelMore: "",
  });

  const goTo = (s: number) => setScreen(s);

  return (
    <div className="theme-mission min-h-screen">
      <div className="bg-background min-h-screen">
        {screen === 0 && <IntroScreen onNext={() => goTo(1)} onHistory={() => goTo(4)} />}
        {screen === 1 && (
          <ValuesScreen
            selected={data.values}
            onSelect={(v) => setData((d) => ({ ...d, values: v }))}
            onNext={() => goTo(2)}
          />
        )}
        {screen === 2 && (
          <ReflectionScreen
            data={data}
            onChange={(d) => setData((prev) => ({ ...prev, ...d }))}
            onNext={() => goTo(3)}
          />
        )}
        {screen === 3 && (
          <MissionScreen data={data} onEdit={() => goTo(2)} onHome={() => goTo(0)} onChange={(d) => setData((prev) => ({ ...prev, ...d }))} />
        )}
        {screen === 4 && <HistoryScreen onBack={() => goTo(0)} />}
      </div>
    </div>
  );
}
