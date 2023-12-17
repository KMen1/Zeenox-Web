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
import { useEffect, useState } from "react";
import { QueueProvider } from "../QueueProvider";
import { PlayerStateProvider } from "../PlayerStateProvider";
import { CurrentTrackProvider } from "../CurrentTrackProvider";
import { PlayerPositionProvider } from "../PlayerPositionProvider";
import { PlayerRepeatModeProvider } from "../PlayerRepeatModeProvider";
import { ListenersProvider } from "../ChannelInfoProvider";
import { PlayerActionsProvider } from "../PlayerActionsProvider";
import { IconCheck, IconNetwork } from "@tabler/icons-react";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { PlayerVolumeProvider } from "../PlayerVolumeProvider";
import { InitDataProvider } from "../InitDataProvider";

let socket: WebSocket | null = null;

export function SocketProvider({
  id,
  children,
  socketSessionToken,
}: {
  id: string;
  children: React.ReactNode;
  socketSessionToken: string;
}) {
  const [init, setInitData] = useState<{ initData: InitData | null }>({
    initData: null,
  });
  const [player, setPlayer] = useState<{ player: PlayerData | null }>({
    player: null,
  });
  const [track, setTrack] = useState<{ track: TrackData | null }>({
    track: null,
  });
  const [queue, setQueue] = useState<{ queue: QueueData | null }>({
    queue: null,
  });
  const [actions, setActions] = useState<{ actions: Action[] | null }>({
    actions: null,
  });

  useEffect(() => {
    const notificatonId = `connect-socket-${Date.now()}`;
    showNotification(notificatonId, `Connecting to server`, null, true);
    socket = new WebSocket(
      `wss://zeenox.tech/api/v1/socket?id=${id}`
      //`ws://192.168.0.100:5225/api/v1/socket?id=${id}`
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
      console.error(`Socket disconnected with reason: ${ev.reason}`);
      updateNotification(
        notificatonId,
        `Disconnected from server`,
        <IconNetwork />,
        "red",
        `Disconnected from server with reason: ${ev.reason}`
      );
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data as string) as ServerMessageData;
      console.log(data);
      switch (data.Type) {
        case "player-init":
          setInitData({ initData: data as InitData });
          break;
        case "player-data":
          setPlayer({ player: data as PlayerData });
          break;
        case "player-track":
          setTrack({ track: data as TrackData });
          break;
        case "player-queue":
          setQueue({ queue: data as QueueData });
          break;
        case "player-actions":
          setActions({ actions: (data as ActionsData).Actions.reverse() });
          break;
        case "player-action":
          const action = (data as ActionData).Action as Action;
          setActions((state) => {
            if (!state.actions) return { actions: [action] };
            return { actions: [action, ...state.actions] };
          });
          break;
      }
    };
    return () => {
      socket?.close();
    };
  }, [id, socketSessionToken]);

  return (
    <InitDataProvider data={init}>
      <QueueProvider data={queue}>
        <PlayerStateProvider state={player.player?.State}>
          <PlayerRepeatModeProvider repeatMode={player.player?.RepeatMode}>
            <PlayerPositionProvider
              data={{ position: player.player?.Position || 0 }}
            >
              <PlayerVolumeProvider data={{ volume: player.player?.Volume }}>
                <ListenersProvider
                  listeners={player.player?.Listeners}
                  name={init.initData?.VoiceChannelName}
                >
                  <CurrentTrackProvider data={track}>
                    <PlayerActionsProvider data={actions}>
                      {children}
                    </PlayerActionsProvider>
                  </CurrentTrackProvider>
                </ListenersProvider>
              </PlayerVolumeProvider>
            </PlayerPositionProvider>
          </PlayerRepeatModeProvider>
        </PlayerStateProvider>
      </QueueProvider>
    </InitDataProvider>
  );
}
