"use client";
import { useEffect } from "react";
import { IconCheck, IconNetwork } from "@tabler/icons-react";
import {
  showNotification,
  updateNotification,
} from "@/utils/notificationUtils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  actionFetchAtom,
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
import { useDisclosure } from "@mantine/hooks";
import { ResumeSessionModal } from "./ResumeSessionModal/ResumeSessionModal";
import {
  Action,
  AddActionPayload,
  AddActionsPayload,
  InitPayload,
  Payload,
  PayloadType,
  Track,
  UpdatePlayerPayload,
  UpdateQueuePayload,
} from "@/types/socket";

let socket: WebSocket | null = null;

export function Socket({
  id,
  socketSessionToken,
}: {
  id: string;
  socketSessionToken: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const setServerSessionToken = useSetAtom(serverSessionTokenAtom);
  useEffect(() => {
    setServerSessionToken(socketSessionToken);
  }, [socketSessionToken, setServerSessionToken]);
  const [init, setInit] = useAtom(initAtom);
  const setQueue = useSetAtom(queueAtom);
  const setTrack = useSetAtom(trackAtom);
  const setActions = useSetAtom(actionsAtom);
  const setVolume = useSetAtom(volumeAtom);
  const setRepeat = useSetAtom(repeatAtom);
  const setPosition = useSetAtom(positionAtom);
  const setState = useSetAtom(stateAtom);
  const setListeners = useSetAtom(listenersAtom);
  const { resumeSession } = useAtomValue(actionFetchAtom);

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
        <IconCheck width="70%" height="70%" />,
        "green"
      );
    };
    socket.onclose = (ev) => {
      updateNotification(
        notificatonId,
        ev.code === 1006 ? "Unable to connect!" : `Disconnected from server`,
        <IconNetwork width="70%" height="70%" />,
        "red",
        ev.code === 1006
          ? "Connect to a voice channel to start listening!"
          : `Disconnected from server with reason: ${ev.reason}`
      );
    };
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data as string) as Payload;
      switch (payload.Type) {
        case PayloadType.InitPlayer:
          const initPayload = payload as InitPayload;
          setInit(initPayload);
          if (initPayload.ResumeSession) {
            open();
          }
          break;
        case PayloadType.UpdatePlayer:
          const playerData = payload as UpdatePlayerPayload;
          setVolume(playerData.Volume);
          setRepeat(playerData.RepeatMode);
          setPosition(playerData.Position || 0);
          setState(playerData.State);
          setListeners(playerData.Listeners);
          break;
        case PayloadType.UpdateTrack:
          setTrack(payload as Track);
          break;
        case PayloadType.UpdateQueue:
          setQueue((payload as UpdateQueuePayload).Tracks);
          break;
        case PayloadType.AddAction:
          const action = (payload as AddActionPayload).Action as Action;
          setActions((state) => {
            if (!state) return [action];
            return [action, ...state];
          });
          break;
        case PayloadType.AddActions:
          setActions((payload as AddActionsPayload).Actions.reverse());
          break;
      }
    };
    return () => {
      socket?.close();
    };
  }, [
    id,
    open,
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

  const resumeData = init?.ResumeSession!;

  function resumeSessionHandler() {
    const notificatonId = `resume-session-${Date.now()}`;
    showNotification(notificatonId, `Resuming session`, null, true);
    resumeSession().then((res) => {
      if (res.success) {
        updateNotification(
          notificatonId,
          `Resumed session`,
          <IconCheck />,
          "green",
          "Successfully resumed session!"
        );
      } else {
        updateNotification(
          notificatonId,
          `Unable to resume session`,
          <IconNetwork />,
          "red",
          "Unable to resume session!"
        );
      }
    });
    close();
  }

  return resumeData ? (
    <ResumeSessionModal
      opened={opened}
      onClose={close}
      onResume={resumeSessionHandler}
      resumeData={resumeData}
    />
  ) : (
    <></>
  );
}
