"use client";

import {
  type QueueData,
  type PlayerData,
  TrackData,
  ActionData,
  ActionsData,
  Action,
  InitData,
  ServerMessageData,
} from "@/types";
import { useEffect } from "react";
import { IconCheck, IconNetwork } from "@tabler/icons-react";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { useSetAtom } from "jotai";
import {
  actionsAtom,
  initAtom,
  listenersAtom,
  positionAtom,
  queueAtom,
  repeatAtom,
  serverSessionTokenAtom,
  stateAtom,
  trackAtom,
  volumeAtom,
} from "@/utils/atoms";

let socket: WebSocket | null = null;

export function Socket({
  id,
  socketSessionToken,
}: {
  id: string;
  socketSessionToken: string;
}) {
  const setServerSessionToken = useSetAtom(serverSessionTokenAtom);
  useEffect(() => {
    setServerSessionToken(socketSessionToken);
  }, [socketSessionToken, setServerSessionToken]);
  const setInit = useSetAtom(initAtom);
  const setQueue = useSetAtom(queueAtom);
  const setTrack = useSetAtom(trackAtom);
  const setActions = useSetAtom(actionsAtom);
  const setVolume = useSetAtom(volumeAtom);
  const setRepeat = useSetAtom(repeatAtom);
  const setPosition = useSetAtom(positionAtom);
  const setState = useSetAtom(stateAtom);
  const setListeners = useSetAtom(listenersAtom);

  useEffect(() => {
    const notificatonId = `connect-socket-${Date.now()}`;
    showNotification(notificatonId, `Connecting to server`, null, true);
    socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/api/v1/socket?id=${id}`
    );
    socket.onopen = () => {
      socket?.send(socketSessionToken);
      updateNotification(
        notificatonId,
        `Connected to server`,
        <IconCheck />,
        "green",
        "Successfully connected to server!"
      );
    };
    socket.onclose = (ev) => {
      updateNotification(
        notificatonId,
        ev.code === 1006 ? "Unable to connect!" : `Disconnected from server`,
        <IconNetwork />,
        "red",
        ev.code === 1006
          ? "Connect to a voice channel to start listening!"
          : `Disconnected from server with reason: ${ev.reason}`
      );
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data as string) as ServerMessageData;
      switch (data.Type) {
        case "player-init":
          setInit(data as InitData);
          break;
        case "player-data":
          const playerData = data as PlayerData;
          setVolume(playerData.Volume);
          setRepeat(playerData.RepeatMode);
          setPosition(playerData.Position || 0);
          setState(playerData.State);
          setListeners(playerData.Listeners);
          break;
        case "player-track":
          setTrack(data as TrackData);
          break;
        case "player-queue":
          setQueue((data as QueueData).Tracks);
          break;
        case "player-actions":
          setActions((data as ActionsData).Actions.reverse());
          break;
        case "player-action":
          const action = (data as ActionData).Action as Action;
          setActions((state) => {
            if (!state) return [action];
            return [action, ...state];
          });
          break;
      }
    };
    return () => {
      socket?.close();
    };
  }, [
    id,
    setActions,
    setInit,
    setListeners,
    setPosition,
    setQueue,
    setRepeat,
    setState,
    setTrack,
    setVolume,
    socketSessionToken,
  ]);

  return <></>;
}
