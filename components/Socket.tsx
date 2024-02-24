"use client";
import {
  AddActionPayload,
  AddActionsPayload,
  InitPlayerPayload,
  Payload,
  UpdatePlayerPayload,
  UpdateQueuePayload,
  UpdateTrackPayload,
} from "@/types/payloads";
import { Action, PayloadType } from "@/types/socket";
import {
  actionsAtom,
  botTokenAtom,
  currentTrackAtom,
  historyAtom,
  initAtom,
  isAutoPlayEnabledAtom,
  listenersAtom,
  playerStateAtom,
  positionAtom,
  queueAtom,
  trackRepeatModeAtom,
  volumeAtom,
} from "@/utils/atoms";
import { useDisclosure } from "@mantine/hooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { ReconnectModal } from "./Modals/ReconnectModal";
import { ResumeSessionModal } from "./Modals/ResumeSessionModal";
import { deletePreviousSession, resumePreviousSession } from "./actions";

let socket: WebSocket | null = null;

export function Socket({ id, botToken }: { id: string; botToken: string }) {
  const [resumeModalopened, resumeModalHandlers] = useDisclosure(false);
  const openResumeModal = resumeModalHandlers.open;
  const closeResumeModal = resumeModalHandlers.close;

  const [reconnectModalOpened, reconnectModalHandlers] = useDisclosure(false);
  const openReconnectModal = reconnectModalHandlers.open;
  const closeReconnectModal = reconnectModalHandlers.close;

  const setBotToken = useSetAtom(botTokenAtom);
  useEffect(() => {
    setBotToken(botToken);
  }, [botToken, setBotToken]);

  const [init, setInit] = useAtom(initAtom);
  const setQueue = useSetAtom(queueAtom);
  const setHistory = useSetAtom(historyAtom);
  const setTrack = useSetAtom(currentTrackAtom);
  const setActions = useSetAtom(actionsAtom);
  const setVolume = useSetAtom(volumeAtom);
  const setRepeat = useSetAtom(trackRepeatModeAtom);
  const setPosition = useSetAtom(positionAtom);
  const setState = useSetAtom(playerStateAtom);
  const setListeners = useSetAtom(listenersAtom);
  const setAutoPlay = useSetAtom(isAutoPlayEnabledAtom);

  useEffect(() => {
    const notificatonId = `connect-socket-${Date.now()}`;
    showNotification({
      id: notificatonId,
      title: `Connecting...`,
      loading: true,
      message: null,
      color: "gray",
      icon: null,
      autoClose: false,
      withBorder: true,
    });
    socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/api/v1/socket?id=${id}`
    );
    socket.onopen = () => {
      socket?.send(botToken);
      updateNotification({
        id: notificatonId,
        title: `Connected`,
        loading: false,
        message: null,
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: true,
      });
      closeReconnectModal();
    };
    socket.onclose = () => {
      openReconnectModal();
    };
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data as string) as Payload;
      switch (payload.Type) {
        case PayloadType.InitPlayer:
          const initPayload = payload as InitPlayerPayload;
          setInit(initPayload);
          const player = initPayload.Player;
          setVolume(player.Volume);
          setRepeat(player.TrackRepeatMode);
          setPosition(player.Position || 0);
          setState(player.State);
          setListeners(player.Listeners);
          setTrack(initPayload.CurrentTrack);
          setQueue(initPayload.Queue.Tracks);
          setAutoPlay(player.IsAutoPlayEnabled);
          setHistory(initPayload.Queue.History.reverse());
          setActions(initPayload.Actions.reverse());
          if (initPayload.ResumeSession) {
            openResumeModal();
          }
          break;
        case PayloadType.UpdatePlayer:
          const playerData = (payload as UpdatePlayerPayload).Player;
          setVolume(playerData.Volume);
          setRepeat(playerData.TrackRepeatMode);
          setPosition(playerData.Position || 0);
          setState(playerData.State);
          setListeners(playerData.Listeners);
          setAutoPlay(playerData.IsAutoPlayEnabled);
          break;
        case PayloadType.UpdateTrack:
          const track = (payload as UpdateTrackPayload).Track;
          setTrack(track);
          break;
        case PayloadType.UpdateQueue:
          const queue = (payload as UpdateQueuePayload).Queue;
          setQueue(queue.Tracks);
          setHistory(queue.History.reverse());
          break;
        case PayloadType.AddAction:
          const action = (payload as AddActionPayload).Action as Action;
          setActions((state) => {
            if (!state) return [action];
            return [action, ...state].slice(0, 10);
          });
          break;
        case PayloadType.AddActions:
          setActions(
            (payload as AddActionsPayload).Actions.slice(0, 10).reverse()
          );
          break;
      }
    };
    return () => {
      socket?.close();
    };
  }, [
    botToken,
    closeReconnectModal,
    id,
    openReconnectModal,
    openResumeModal,
    setActions,
    setAutoPlay,
    setHistory,
    setInit,
    setListeners,
    setPosition,
    setQueue,
    setRepeat,
    setState,
    setTrack,
    setVolume,
  ]);

  const resumeData = init?.ResumeSession!;

  async function onResume() {
    await resumePreviousSession(botToken);
    closeResumeModal();
  }

  async function onDelete() {
    await deletePreviousSession(botToken);
    closeResumeModal();
  }

  return (
    <>
      {resumeData && (
        <ResumeSessionModal
          opened={resumeModalopened}
          onClose={closeResumeModal}
          onResume={onResume}
          onDelete={onDelete}
        />
      )}
      <ReconnectModal opened={reconnectModalOpened} />
    </>
  );
}
