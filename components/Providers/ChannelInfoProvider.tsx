"use client";

import { DiscordUserData } from "@/types";
import { createContext, useContext } from "react";

type ChannelData = {
  Name: string;
  Listeners: DiscordUserData[];
};

const ChannelInfoContext = createContext<ChannelData | undefined>(undefined);

export function ListenersProvider({
  children,
  name,
  listeners,
}: {
  children: React.ReactNode;
  name: string | undefined | null;
  listeners: DiscordUserData[] | undefined;
}) {
  const channelData = {
    Name: name || "Unknown",
    Listeners: listeners || [],
  };
  return (
    <ChannelInfoContext.Provider value={channelData}>
      {children}
    </ChannelInfoContext.Provider>
  );
}

export function useChannelInfo() {
  const context = useContext(ChannelInfoContext);
  if (context === undefined) {
    throw new Error("useListeners must be used within a ListenersProvider");
  }
  return context;
}
