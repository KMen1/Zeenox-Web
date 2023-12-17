"use client";

import { type TrackData } from "@/types";
import { createContext, useContext, useEffect, useMemo } from "react";

const CurrentTrackContext = createContext<{ track: TrackData | null }>({
  track: null,
});

export function CurrentTrackProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { track: TrackData | null };
}) {
  return (
    <CurrentTrackContext.Provider value={data}>
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
