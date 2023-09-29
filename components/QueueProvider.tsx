"use client";

import { type QueueData } from "@/types";
import { createContext, useContext } from "react";

const QueueDataContext = createContext<QueueData | undefined>(undefined);

export function QueueProvider({
  children,
  queue,
}: {
  children: React.ReactNode;
  queue: QueueData;
}) {
  return (
    <QueueDataContext.Provider value={queue}>
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
