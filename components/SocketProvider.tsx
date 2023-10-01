"use client";

import {
  type Action,
  ActionType,
  type ServerMessage,
  type QueueData,
  type PlayerData,
} from "@/types";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconExclamationCircle,
} from "@tabler/icons-react";
import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { QueueProvider } from "./QueueProvider";
import { PlayerStateProvider } from "./PlayerStateProvider";
import { CurrentTrackProvider } from "./CurrentTrackProvider";
import { PlayerPositionProvider } from "./PlayerPositionProvider";
import { PlayerRepeatModeProvider } from "./PlayerRepeatModeProvider";
import { useSession } from "next-auth/react";
import { ListenersProvider } from "./ListenersProvider";

const SocketDataContext = createContext<ServerMessage | null>(null);
const SocketActionContext = createContext<
  ((action: string, payload?: any) => Promise<void>) | null
>(null);

let socket: WebSocket | null = null;

export function SocketProvider({
  id,
  children,
  initialData,
  serverSessionToken,
}: {
  id: string;
  children: React.ReactNode;
  initialData: ServerMessage;
  serverSessionToken: string;
}) {
  const userId = useSession().data?.user?.id;
  const [state, dispatch] = useReducer(MessageReducer, initialData);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  useEffect(() => {
    notifications.show({
      id: "connect-socket",
      loading: true,
      title: "Connecting to server...",
      message:
        "Please wait while we connect to the server, you cannot close this yet!",
      autoClose: false,
      withCloseButton: false,
    });
    socket = new WebSocket(
      `wss://zeenox.tech/api/v1/WebSocket/Connect?id=${id}`
    );
    socket.onopen = () => {
      socket?.send(serverSessionToken);
    };
    socket.onclose = () => {
      notifications.show({
        id: "disconnect-socket",
        color: "red",
        title: "Disconnected from server!",
        message: "Please refresh the page to reconnect!",
        icon: <IconExclamationCircle size="1rem" />,
        autoClose: false,
        withCloseButton: true,
      });
    };
    socket.onmessage = (event) => {
      if (event.data === "Connected") {
        notifications.update({
          id: "connect-socket",
          loading: false,
          color: "green",
          title: "Successfully connected to server!",
          message: "You can now close this notification!",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
          withCloseButton: true,
        });
      } else {
        const data = JSON.parse(event.data as string) as ServerMessage;
        if (data.Player?.ShouldUpdate) {
          dispatch({ type: ActionType.UPDATEPLAYER, payload: data.Player });
        }
        if (data.Track?.ShouldUpdate) {
          dispatch({ type: ActionType.UPDATETRACK, payload: data.Track });
        }
        if (data.Queue?.ShouldUpdate) {
          dispatch({ type: ActionType.UPDATEQUEUE, payload: data.Queue });
        }
      }
    };
    return () => {
      socket?.close();
    };
  }, [id, serverSessionToken, userId]);

  const performAction = useCallback(
    async (action: string, payload?: object) => {
      if (isPerformingAction) {
        notifications.show({
          id: `perform-action-wait-${Date.now()}`,
          title: "Hold on!",
          color: "yellow",
          message: "Please wait for the current action to finish!",
          icon: <IconAlertTriangle size="1rem" />,
          autoClose: 2000,
          withCloseButton: true,
        });
        return;
      }

      notifications.show({
        id: `perform-action-${action}`,
        loading: true,
        title: "Performing action...",
        message: "Please wait while we perform the action!",
        autoClose: false,
        withCloseButton: false,
      });
      try {
        setIsPerformingAction(true);
        let queryString = "";
        if (payload) {
          for (const [key, value] of Object.entries(payload)) {
            if (queryString === "") queryString += "?";
            else queryString += "&";
            queryString += `${key}=${value}`;
          }
        }

        const res = await fetch(`/api/player/${action}` + queryString, {
          method: "POST",
        });
        setIsPerformingAction(false);
        if (!res.ok) {
          notifications.update({
            id: `perform-action-${action}`,
            color: "red",
            title: "Failed to perform action!",
            message: "Please try again later!",
            icon: <IconExclamationCircle size="1rem" />,
            autoClose: 2000,
            withCloseButton: true,
            loading: false,
          });
          return;
        }
        notifications.update({
          id: `perform-action-${action}`,
          color: "green",
          title: "Successfully performed action!",
          message: "You can now close this notification!",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
          withCloseButton: true,
          loading: false,
        });

        if (action === "remove") {
          dispatch({
            type: ActionType.UPDATEQUEUE,
            payload: {
              ...state.Queue,
              Tracks: (state.Queue as QueueData).Tracks?.filter(
                (_, i) => i !== (payload as { index: number }).index
              ),
            },
          });
        }
      } catch (error) {
        console.error(error);
        notifications.update({
          id: `perform-action-${action}`,
          color: "red",
          title: "Failed to perform action!",
          message: "Please try again later!",
          icon: <IconExclamationCircle size="1rem" />,
          autoClose: 2000,
        });
        setIsPerformingAction(false);
        return;
      }
    },
    [isPerformingAction, state.Queue]
  );

  return (
    <SocketDataContext.Provider value={state}>
      <SocketActionContext.Provider value={performAction}>
        <QueueProvider queue={state.Queue}>
          <PlayerStateProvider state={(state.Player as PlayerData).State}>
            <PlayerRepeatModeProvider
              repeatMode={(state.Player as PlayerData).RepeatMode}
            >
              <PlayerPositionProvider
                position={(state.Player as PlayerData).Position}
              >
                <ListenersProvider
                  listeners={(state.Player as PlayerData).Listeners}
                >
                  <CurrentTrackProvider track={state.Track}>
                    {children}
                  </CurrentTrackProvider>
                </ListenersProvider>
              </PlayerPositionProvider>
            </PlayerRepeatModeProvider>
          </PlayerStateProvider>
        </QueueProvider>
      </SocketActionContext.Provider>
    </SocketDataContext.Provider>
  );
}

export function useSocketData() {
  const context = useContext(SocketDataContext);
  if (context === undefined) {
    throw new Error("useSocketData must be used within a SocketDataProvider");
  }
  return context;
}

export function useSocketAction() {
  const context = useContext(SocketActionContext);
  if (context === undefined) {
    throw new Error(
      "useSocketAction must be used within a SocketActionProvider"
    );
  }
  return context;
}

function MessageReducer(state: ServerMessage, action: Action) {
  const { type, payload } = action;
  switch (type) {
    case ActionType.UPDATEPLAYER:
      return { ...state, Player: payload };
    case ActionType.UPDATETRACK:
      return { ...state, Track: payload };
    case ActionType.UPDATEQUEUE:
      return { ...state, Queue: payload };
    default:
      return state;
  }
}
