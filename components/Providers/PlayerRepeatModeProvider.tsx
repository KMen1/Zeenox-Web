"use client";

import { RepeatMode } from "@/types";
import { createContext, useContext } from "react";

const PlayerRepeatModeContext = createContext<{
  repeatMode: RepeatMode | null | undefined;
}>({ repeatMode: null });

export function PlayerRepeatModeProvider({
  children,
  repeatMode,
}: {
  children: React.ReactNode;
  repeatMode: RepeatMode | null | undefined;
}) {
  return (
    <PlayerRepeatModeContext.Provider value={{ repeatMode }}>
      {children}
    </PlayerRepeatModeContext.Provider>
  );
}

export function usePlayerRepeatMode() {
  const context = useContext(PlayerRepeatModeContext);
  if (context === undefined) {
    throw new Error(
      "usePlayerRepeatMode must be used within a PlayerRepeatModeProvider"
    );
  }
  return context;
}
