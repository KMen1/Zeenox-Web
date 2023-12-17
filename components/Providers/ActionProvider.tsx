"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

export type ActionResult = {
  success: boolean;
  error?: string;
};

const ActionContext = createContext<{
  playTrack: (url: string) => Promise<ActionResult>;
  pause: () => Promise<ActionResult>;
  resume: () => Promise<ActionResult>;
  skipTrack: () => Promise<ActionResult>;
  backTrack: () => Promise<ActionResult>;
  seekTrack: (position: number) => Promise<ActionResult>;
  setVolume: (volume: number) => Promise<ActionResult>;
  addTrack: (url: string) => Promise<ActionResult>;
  removeTrack: (index: number) => Promise<ActionResult>;
  clearQueue: () => Promise<ActionResult>;
  shuffleQueue: () => Promise<ActionResult>;
  distinctQueue: () => Promise<ActionResult>;
  reverseQueue: () => Promise<ActionResult>;
  skipToTrack: (index: number) => Promise<ActionResult>;
  moveTrack: (from: number, to: number) => Promise<ActionResult>;
  cycleRepeatMode: () => Promise<ActionResult>;
}>({
  playTrack: async () => {
    return { success: false };
  },
  pause: async () => {
    return { success: false };
  },
  resume: async () => {
    return { success: false };
  },
  skipTrack: async () => {
    return { success: false };
  },
  backTrack: async () => {
    return { success: false };
  },
  seekTrack: async () => {
    return { success: false };
  },
  setVolume: async () => {
    return { success: false };
  },
  addTrack: async () => {
    return { success: false };
  },
  removeTrack: async () => {
    return { success: false };
  },
  clearQueue: async () => {
    return { success: false };
  },
  distinctQueue: async () => {
    return { success: false };
  },
  shuffleQueue: async () => {
    return { success: false };
  },
  reverseQueue: async () => {
    return { success: false };
  },
  skipToTrack: async () => {
    return { success: false };
  },
  moveTrack: async () => {
    return { success: false };
  },
  cycleRepeatMode: async () => {
    return { success: false };
  },
});

export function ActionProvider({
  children,
  socketSessionToken,
}: {
  children: React.ReactNode;
  socketSessionToken: string;
}) {
  const baseFetch = useCallback(
    async (method: string, params?: string, options?: RequestInit) => {
      const res = await fetch(
        `/api/player/${method}?token=${socketSessionToken}${
          params ? `&${params}` : ""
        }`,
        { method: "POST", ...options }
      );
      if (res.ok) {
        return { success: true };
      } else {
        const data = await res.text();
        return { success: false, error: data };
      }
    },
    [socketSessionToken]
  );

  const playTrack = useCallback(
    async (url: string) => {
      return baseFetch(`playTrack`, `url=${url}`);
    },
    [baseFetch]
  );

  const pause = useCallback(async () => {
    return baseFetch(`pause`);
  }, [baseFetch]);

  const resume = useCallback(async () => {
    return baseFetch(`resume`);
  }, [baseFetch]);

  const skipTrack = useCallback(async () => {
    return baseFetch(`skipTrack`);
  }, [baseFetch]);

  const backTrack = useCallback(async () => {
    return baseFetch(`backTrack`);
  }, [baseFetch]);

  const seekTrack = useCallback(
    async (position: number) => {
      return baseFetch(`seekTrack`, `position=${position}`);
    },
    [baseFetch]
  );

  const setVolume = useCallback(
    async (volume: number) => {
      return baseFetch(`setVolume`, `volume=${volume}`);
    },
    [baseFetch]
  );

  const addTrack = useCallback(
    async (url: string) => {
      return baseFetch(`addTrack`, `url=${url}`);
    },
    [baseFetch]
  );

  const removeTrack = useCallback(
    async (index: number) => {
      return baseFetch(`removeTrack`, `index=${index}`);
    },
    [baseFetch]
  );

  const clearQueue = useCallback(async () => {
    return baseFetch(`clearQueue`);
  }, [baseFetch]);

  const shuffleQueue = useCallback(async () => {
    return baseFetch(`shuffleQueue`);
  }, [baseFetch]);

  const distinctQueue = useCallback(async () => {
    return baseFetch(`distinctQueue`);
  }, [baseFetch]);

  const reverseQueue = useCallback(async () => {
    return baseFetch(`reverseQueue`);
  }, [baseFetch]);

  const skipToTrack = useCallback(
    async (index: number) => {
      return baseFetch(`skipToTrack`, `index=${index}`);
    },
    [baseFetch]
  );

  const moveTrack = useCallback(
    async (from: number, to: number) => {
      return baseFetch(`moveTrack`, `from=${from}&to=${to}`);
    },
    [baseFetch]
  );

  const cycleRepeatMode = useCallback(async () => {
    return baseFetch(`cycleRepeatMode`);
  }, [baseFetch]);

  const value = useMemo(() => {
    return {
      playTrack,
      pause,
      resume,
      skipTrack,
      backTrack,
      seekTrack,
      setVolume,
      addTrack,
      removeTrack,
      clearQueue,
      shuffleQueue,
      distinctQueue,
      reverseQueue,
      skipToTrack,
      moveTrack,
      cycleRepeatMode,
    };
  }, [
    addTrack,
    backTrack,
    clearQueue,
    cycleRepeatMode,
    distinctQueue,
    moveTrack,
    pause,
    playTrack,
    removeTrack,
    resume,
    reverseQueue,
    seekTrack,
    setVolume,
    shuffleQueue,
    skipToTrack,
    skipTrack,
  ]);

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}

export function useActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error("useActions must be used within a ActionProvider");
  }
  return context;
}
