"use client";

import { ActionsPanel } from "@/features/actions-panel";
import { LyricsCard } from "@/features/lyrics-panel";
import { selectedAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { PanelSwitcher } from "./PanelSwitcher";

export function LyricsActionsSwitcher() {
  const selected = useAtomValue(selectedAtom);

  return (
    <PanelSwitcher
      selected={selected}
      panels={{ lyrics: <LyricsCard />, actions: <ActionsPanel /> }}
    />
  );
}
