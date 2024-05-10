"use client";

import { selectedAtom } from "@/stores/atoms";
import { useAtomValue } from "jotai";
import { ActionsPanel } from "../ActionsPanel/ActionsPanel";
import { LyricsCard } from "../LyricsPanel/LyricsPanel";
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
