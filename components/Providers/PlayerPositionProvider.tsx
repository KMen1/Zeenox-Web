"use client";

import { createContext, useContext } from "react";

const PlayerPositionContext = createContext<{ position: number } | undefined>(
  undefined
);

export function PlayerPositionProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { position: number };
}) {
  return (
    <PlayerPositionContext.Provider value={data}>
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
