"use client";

import { DiscordUserData } from "@/types";
import { createContext, useContext } from "react";

const ListenerContext = createContext<DiscordUserData[]>([]);

export function ListenersProvider({
  children,
  listeners,
}: {
  children: React.ReactNode;
  listeners: DiscordUserData[];
}) {
  return (
    <ListenerContext.Provider value={listeners}>
      {children}
    </ListenerContext.Provider>
  );
}

export function useListeners() {
  const context = useContext(ListenerContext);
  if (context === undefined) {
    throw new Error("useListeners must be used within a ListenersProvider");
  }
  return context;
}
