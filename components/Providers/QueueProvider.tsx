"use client";

import { type QueueData } from "@/types";
import { createContext, useContext } from "react";

const QueueDataContext = createContext<{
  queue: QueueData | null;
}>({
  queue: null,
});

export function QueueProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { queue: QueueData | null };
}) {
  return (
    <QueueDataContext.Provider value={data}>
      {children}
    </QueueDataContext.Provider>
  );
}

export function useQueueData() {
  const context = useContext(QueueDataContext);
  if (context === undefined) {
    throw new Error("useQueueData must be used within a QueueProvider");
  }
  return context;
}
