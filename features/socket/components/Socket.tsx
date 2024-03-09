"use client";

import { Action } from "@/features/actions-panel";
import { botTokenAtom } from "@/stores/atoms";
import { Player, Queue, Track } from "@/types/socket";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useSetters } from "../hooks/useSetters";
import { Payload, PayloadType } from "../types/socket";
import { getPlayer, getSessionData } from "../utils/actions";
import { ReconnectModal } from "./ReconnectModal";
import { ResumeSessionModal } from "./ResumeSessionModal";

let socket: WebSocket | null = null;

export function Socket({ id, botToken }: { id: string; botToken: string }) {
  const setToken = useSetAtom(botTokenAtom);

  useEffect(() => {
    setToken(botToken);
  }, [botToken, setToken]);

  const [reconnectModalOpened, reconnectModalHandlers] = useDisclosure(false);
  const openReconnectModal = reconnectModalHandlers.open;
  const closeReconnectModal = reconnectModalHandlers.close;

  const setters = useSetters();

  useEffect(() => {
    async function initPlayer() {
      const res = await getPlayer(botToken);
      if (!res) return;
      const playerState = res.Player;
      setters.setResumeSession(res.ResumeSession);
      setters.setStartedAt(res.StartedAt);
      setters.setChannelName(res.VoiceChannelName);
      setTrack(res.CurrentTrack);
      setPlayer(playerState);
      setQueue(res.Queue);
      setActions(res.Actions);
    }

    function setPlayer(player: Player) {
      setters.setPosition(player.Position);
      setters.setState(player.State);
      setters.setListeners(player.Listeners);
      setters.setVolume(player.Volume);
      setters.setRepeat(player.TrackRepeatMode);
      setters.setAutoPlay(player.IsAutoPlayEnabled);
    }

    function setTrack(track: Track | null) {
      setters.setTrack(track);
    }

    function setQueue(queue: Queue) {
      setters.setQueue(queue.Tracks);
      setters.setHistory(queue.History.reverse());
    }

    function setActions(actions: Action[]) {
      setters.setActions(actions.reverse().slice(0, 10));
    }

    socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/api/v1/socket?id=${id}`
    );
    socket.onopen = async () => {
      socket?.send(botToken);
      showNotification({
        title: `Connected`,
        loading: false,
        message: null,
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: true,
        withBorder: true,
      });
      closeReconnectModal();
      await initPlayer();
    };
    socket.onclose = () => {
      openReconnectModal();
    };
    socket.onmessage = async (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as Payload;
      const type = payload.Type as PayloadType;

      const res = await getSessionData(botToken, type);
      if (!res) return;

      if (type & PayloadType.UpdatePlayer) {
        setPlayer(res.State);
      }
      if (type & PayloadType.UpdateTrack) {
        setTrack(res.CurrentTrack);
      }
      if (type & PayloadType.UpdateQueue) {
        setQueue(res.Queue);
      }
      if (type & PayloadType.UpdateActions) {
        setActions(res.Actions);
      }
    };
    return () => {
      socket?.close();
    };
  }, []);

  return (
    <>
      <ResumeSessionModal />
      <ReconnectModal opened={reconnectModalOpened} />
    </>
  );
}
