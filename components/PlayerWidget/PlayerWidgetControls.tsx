"use client";

import { PlayerState, RepeatMode } from "@/types";
import {
  faBackwardStep,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Center, Flex } from "@mantine/core";
import { useCallback } from "react";
import { useSocketAction } from "../SocketProvider";
import { usePlayerState } from "../PlayerStateProvider";
import {
  IconArrowsShuffle,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
} from "@tabler/icons-react";
import { usePlayerRepeatMode } from "../PlayerRepeatModeProvider";

export default function PlayerWidgetControls() {
  const state = usePlayerState();
  const repeatMode = usePlayerRepeatMode();
  const performAction = useSocketAction()!;

  const shuffle = useCallback(
    () => void performAction("shuffle"),
    [performAction]
  );
  const back = useCallback(() => void performAction("back"), [performAction]);
  const next = useCallback(() => void performAction("next"), [performAction]);
  const pause = useCallback(() => void performAction("pause"), [performAction]);
  const repeat = useCallback(
    () => void performAction("repeat"),
    [performAction]
  );

  return (
    <Center>
      <Flex gap={15} align="center">
        <button onClick={shuffle}>
          <IconArrowsShuffle
            color="lightgray"
            size="1rem"
            className="duration-100c transition-all ease-in-out hover:text-white"
          />
        </button>
        <Flex align="center" gap={15}>
          <button onClick={back}>
            <FontAwesomeIcon
              icon={faBackwardStep}
              color="lightgray"
              size="2xl"
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          </button>
          {state === PlayerState.Playing ? (
            <button onClick={pause}>
              <FontAwesomeIcon
                icon={faCirclePause}
                color="white"
                size="3x"
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </button>
          ) : (
            <button onClick={pause}>
              <FontAwesomeIcon
                icon={faCirclePlay}
                color="white"
                size="3x"
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </button>
          )}

          <button onClick={next}>
            <FontAwesomeIcon
              icon={faForwardStep}
              color="lightgray"
              size="2xl"
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          </button>
        </Flex>
        <button onClick={repeat}>
          {repeatMode === RepeatMode.None && (
            <IconRepeatOff
              size="1rem"
              color="lightgray"
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          )}
          {repeatMode === RepeatMode.Track && (
            <IconRepeatOnce
              size="1rem"
              color="lightgray"
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          )}
          {repeatMode === RepeatMode.Queue && (
            <IconRepeat
              size="1rem"
              color="lightgray"
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          )}
        </button>
      </Flex>
    </Center>
  );
}
