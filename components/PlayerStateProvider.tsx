"use client";

import { type PlayerState } from "@/types";
import { createContext, useContext } from "react";

const PlayerStateContext = createContext<PlayerState | undefined>(undefined);

export function PlayerStateProvider({
  children,
  state,
}: {
  children: React.ReactNode;
  state: PlayerState;
}) {
  return (
    <PlayerStateContext.Provider value={state}>
      {children}
    </PlayerStateContext.Provider>
  );
}

export function usePlayerState() {
  const context = useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error("usePlayerState must be used within a PlayerStateProvider");
  }
  return context;
}
