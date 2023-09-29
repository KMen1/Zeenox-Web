"use client";

import { type TrackData } from "@/types";
import { createContext, useContext } from "react";

const CurrentTrackContext = createContext<TrackData | undefined>(undefined);

export function CurrentTrackProvider({
  children,
  track,
}: {
  children: React.ReactNode;
  track: TrackData;
}) {
  return (
    <CurrentTrackContext.Provider value={track}>
      {children}
    </CurrentTrackContext.Provider>
  );
}

export function useCurrentTrack() {
  const context = useContext(CurrentTrackContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentTrack must be used within a CurrentTrackProvider"
    );
  }
  return context;
}
