"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Action } from "@/features/actions-panel";
import { botTokenAtom } from "@/stores/atoms";
import { Player, Queue, Track } from "@/types/socket";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSetters } from "../hooks/useSetters";
import { Payload, PayloadType } from "../types/socket";
import { getPlayer, getSessionData } from "../utils/actions";

let socket: WebSocket | null = null;

export function Socket({ id, botToken }: { id: string; botToken: string }) {
  const setToken = useSetAtom(botTokenAtom);

  useEffect(() => {
    setToken(botToken);
  }, [botToken, setToken]);

  const [isDisconnectedOpen, setIsDisconnectedOpen] = useState(false);

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
      `${process.env.NEXT_PUBLIC_WS_URL}/api/v1/socket?id=${id}`,
    );
    socket.onopen = async () => {
      socket?.send(botToken);
      toast("Connected to server");
      setIsDisconnectedOpen(false);
      await initPlayer();
    };
    socket.onclose = () => {
      setIsDisconnectedOpen(true);
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
    <AlertDialog open={isDisconnectedOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnected from server!</AlertDialogTitle>
          <AlertDialogDescription>
            Seems like you have been disconnected from the server. This can
            happen due to a network error, the server being restarted or because
            of inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              window.location.reload();
            }}
          >
            Reconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
