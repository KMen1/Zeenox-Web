"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const WindowSizeContext = createContext<number[]>([0, 0]);

export function WindowSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }, []);

  useEffect(() => {
    const windowSizeHandler = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export function useWindowSize() {
  const context = useContext(WindowSizeContext);
  if (context === undefined) {
    throw new Error("useWindowSize must be used within a WindowSizeProvider");
  }
  return context;
}
