"use client";

import { createContext, useContext } from "react";

const PlayerPositionContext = createContext<number | null>(null);

export function PlayerPositionProvider({
  children,
  position,
}: {
  children: React.ReactNode;
  position: number | null;
}) {
  return (
    <PlayerPositionContext.Provider value={position}>
      {children}
    </PlayerPositionContext.Provider>
  );
}

export function usePlayerPosition() {
  const context = useContext(PlayerPositionContext);
  if (context === undefined) {
    throw new Error(
      "usePlayerPosition must be used within a PlayerPositionProvider"
    );
  }
  return context;
}
