"use client";

import { PlayerState, RepeatMode } from "@/types/socket";
import {
  faBackwardStep,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Center, Flex, Group, Popover, Skeleton } from "@mantine/core";
import {
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
  IconVolume,
} from "@tabler/icons-react";
import classes from "./PlayerControls.module.css";
import { PlayerVolumeSlider } from "../PlayerVolumeSlider/PlayerVolumeSlider";
import { useAtomValue } from "jotai";
import { repeatAtom, stateAtom, trackAtom } from "@/utils/atoms";
import {
  useBack,
  useCycleRepeat,
  usePause,
  useResume,
  useSkip,
} from "@/components/hooks";

export function PlayerControls() {
  const state = useAtomValue(stateAtom);
  const pause = usePause();
  const resume = useResume();
  const skip = useSkip();
  const back = useBack();
  const cycleRepeatMode = useCycleRepeat();
  const currentTrack = useAtomValue(trackAtom);
  const repeatMode = useAtomValue(repeatAtom);

  function pauseOrResume() {
    if (state === PlayerState.Playing) {
      pause();
    } else {
      resume();
    }
  }

  if (repeatMode === null)
    return (
      <>
        <Group gap={15}>
          <Skeleton circle w={16} h={16} />
          <Skeleton circle w={20} h={32} />
          <Skeleton circle w={45} h={45} />
          <Skeleton circle w={20} h={32} />
          <Skeleton circle w={16} h={16} />
        </Group>
      </>
    );

  return (
    <Center>
      <Flex gap={15} align="center">
        <Flex align="center" gap={15}>
          {repeatMode === RepeatMode.None && (
            <IconRepeatOff
              size="1rem"
              color="white"
              role="button"
              onClick={() => cycleRepeatMode()}
              className={classes.controlIcon}
            />
          )}
          {repeatMode === RepeatMode.Track && (
            <IconRepeatOnce
              size="1rem"
              color="white"
              role="button"
              onClick={() => cycleRepeatMode()}
              className={classes.controlIcon}
            />
          )}
          {repeatMode === RepeatMode.Queue && (
            <IconRepeat
              size="1rem"
              color="white"
              role="button"
              onClick={() => cycleRepeatMode()}
              className={classes.controlIcon}
            />
          )}
          <FontAwesomeIcon
            icon={faBackwardStep}
            color="white"
            size="2xl"
            role="button"
            onClick={back}
            className={classes.controlIcon}
          />
          {state === PlayerState.Playing ? (
            <FontAwesomeIcon
              icon={faCirclePause}
              color="white"
              size="3x"
              role="button"
              onClick={pauseOrResume}
              className="transition-all duration-100 ease-in-out hover:text-gray-300"
            />
          ) : (
            <FontAwesomeIcon
              icon={faCirclePlay}
              color="white"
              size="3x"
              role="button"
              onClick={pauseOrResume}
              className="transition-all duration-100 ease-in-out hover:text-gray-300"
            />
          )}
          <FontAwesomeIcon
            icon={faForwardStep}
            color="white"
            size="2xl"
            role="button"
            onClick={() => skip(currentTrack?.Title!)}
            className={classes.controlIcon}
          />
        </Flex>
        <Popover width={150} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <IconVolume
              size="1.1rem"
              color="white"
              role="button"
              className={classes.controlIcon}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <PlayerVolumeSlider />
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </Center>
  );
}
