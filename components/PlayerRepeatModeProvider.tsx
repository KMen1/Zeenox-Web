"use client";

import { type RepeatMode } from "@/types";
import { createContext, useContext } from "react";

const PlayerRepeatModeContext = createContext<RepeatMode | undefined>(
  undefined
);

export function PlayerRepeatModeProvider({
  children,
  repeatMode,
}: {
  children: React.ReactNode;
  repeatMode: RepeatMode;
}) {
  return (
    <PlayerRepeatModeContext.Provider value={repeatMode}>
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
