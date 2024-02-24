"use client";

import {
  cycleRepeatMode,
  pauseTrack,
  resumeTrack,
  rewindTrack,
  skipTrack,
  toggleAutoPlay,
} from "@/components/actions";
import { withNotification } from "@/components/withNotification";
import { PlayerState, TrackRepeatMode } from "@/types/socket";
import {
  botTokenAtom,
  isAutoPlayEnabledAtom,
  playerStateAtom,
  trackRepeatModeAtom,
} from "@/utils/atoms";
import {
  faBackwardStep,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Center, Flex, Group, Skeleton, Tooltip } from "@mantine/core";
import {
  IconRefreshDot,
  IconRefreshOff,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import classes from "./PlayerControls.module.css";

const mainSizeDict = {
  sm: "2x",
  md: "3x",
};

const controlSizeDict = {
  sm: "xl",
  md: "2xl",
};

const iconSizeDict = {
  sm: "1rem",
  md: "1rem",
};

export function PlayerControls({ size }: { size: "sm" | "md" }) {
  const token = useAtomValue(botTokenAtom);
  const state = useAtomValue(playerStateAtom);
  const repeatMode = useAtomValue(trackRepeatModeAtom);
  const autoPlay = useAtomValue(isAutoPlayEnabledAtom);

  const mainSize = mainSizeDict[size] as any;
  const controlSize = controlSizeDict[size] as any;
  const iconSize = iconSizeDict[size];

  async function pauseOrResume() {
    if (state === PlayerState.Playing) {
      await pauseTrack(token);
    } else {
      await resumeTrack(token);
    }
  }

  if (repeatMode === null)
    return (
      <Center>
        <Group gap={15}>
          <Skeleton circle w={16} h={16} />
          <Skeleton circle w={20} h={32} />
          <Skeleton circle w={45} h={45} />
          <Skeleton circle w={20} h={32} />
          <Skeleton circle w={16} h={16} />
        </Group>
      </Center>
    );

  return (
    <Center>
      <Flex gap={15} align="center">
        <Flex align="center" gap={15}>
          {repeatMode === TrackRepeatMode.None && (
            <Tooltip label="No repeat">
              <IconRepeatOff
                size={iconSize}
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className={classes.controlIcon}
              />
            </Tooltip>
          )}
          {repeatMode === TrackRepeatMode.Track && (
            <Tooltip label="Repeat current track">
              <IconRepeatOnce
                size={iconSize}
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className={classes.controlIcon}
              />
            </Tooltip>
          )}
          {repeatMode === TrackRepeatMode.Queue && (
            <Tooltip label="Repeat queue">
              <IconRepeat
                size={iconSize}
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className={classes.controlIcon}
              />
            </Tooltip>
          )}
          <Tooltip label="Rewind">
            <FontAwesomeIcon
              icon={faBackwardStep}
              color="white"
              size={controlSize}
              role="button"
              onClick={async () => withNotification(await rewindTrack(token))}
              className={classes.controlIcon}
            />
          </Tooltip>
          {state === PlayerState.Playing ? (
            <Tooltip label="Pause">
              <FontAwesomeIcon
                icon={faCirclePause}
                color="white"
                size={mainSize}
                role="button"
                onClick={pauseOrResume}
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </Tooltip>
          ) : (
            <Tooltip label="Resume">
              <FontAwesomeIcon
                icon={faCirclePlay}
                color="white"
                size={mainSize}
                role="button"
                onClick={pauseOrResume}
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </Tooltip>
          )}
          <Tooltip label="Skip">
            <FontAwesomeIcon
              icon={faForwardStep}
              color="white"
              size={controlSize}
              role="button"
              onClick={async () => withNotification(await skipTrack(token))}
              className={classes.controlIcon}
            />
          </Tooltip>
          {autoPlay ? (
            <Tooltip label="Autoplay enabled">
              <IconRefreshDot
                size={iconSize}
                color="white"
                role="button"
                className={classes.controlIcon}
                onClick={async () =>
                  withNotification(await toggleAutoPlay(token))
                }
              />
            </Tooltip>
          ) : (
            <Tooltip label="Autoplay disabled">
              <IconRefreshOff
                size={iconSize}
                color="white"
                role="button"
                className={classes.controlIcon}
                onClick={async () =>
                  withNotification(await toggleAutoPlay(token))
                }
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Center>
  );
}
