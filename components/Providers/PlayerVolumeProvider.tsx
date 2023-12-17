"use client";

import { createContext, useContext } from "react";

const PlayerVolumeContext = createContext<{
  volume: number | null | undefined;
}>({ volume: null });

export function PlayerVolumeProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { volume: number | null | undefined };
}) {
  return (
    <PlayerVolumeContext.Provider value={data}>
      {children}
    </PlayerVolumeContext.Provider>
  );
}

export function usePlayerVolume() {
  const context = useContext(PlayerVolumeContext);
  if (context === undefined) {
    throw new Error(
      "usePlayerVolume must be used within a PlayerVolumeProvider"
    );
  }
  return context;
}
