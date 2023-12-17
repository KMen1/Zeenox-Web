"use client";

import { InitData } from "@/types";
import { createContext, useContext } from "react";

const InitDataContext = createContext<{ initData: InitData | null }>({
  initData: null,
});

export function InitDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { initData: InitData | null };
}) {
  return (
    <InitDataContext.Provider value={data}>{children}</InitDataContext.Provider>
  );
}

export function useInitData() {
  const context = useContext(InitDataContext);
  if (context === undefined) {
    throw new Error("useInitData must be used within a InitDataProvider");
  }
  return context;
}
