"use client";

import { Action } from "@/types";
import { createContext, useContext } from "react";

const PlayerActionsContext = createContext<{ actions: Action[] | null }>({
  actions: null,
});

export function PlayerActionsProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { actions: Action[] | null };
}) {
  return (
    <PlayerActionsContext.Provider value={data}>
      {children}
    </PlayerActionsContext.Provider>
  );
}

export function usePlayerActions() {
  const context = useContext(PlayerActionsContext);
  if (context === undefined) {
    throw new Error(
      "usePlayerActions must be used within a PlayerPositionProvider"
    );
  }
  return context;
}
