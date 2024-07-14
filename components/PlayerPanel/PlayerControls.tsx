"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  botTokenAtom,
  isAutoPlayEnabledAtom,
  playerStateAtom,
  trackRepeatModeAtom,
} from "@/stores/atoms";
import { PlayerState, TrackRepeatMode } from "@/types/socket";
import {
  cycleRepeatMode,
  pauseTrack,
  resumeTrack,
  rewindTrack,
  skipTrack,
  toggleAutoPlay,
} from "@/utils/actions";
import { withNotification } from "@/utils/withNotification";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRefreshDot,
  IconRefreshOff,
  IconRepeat,
  IconRepeatOff,
  IconRepeatOnce,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";

export function PlayerControls() {
  const token = useAtomValue(botTokenAtom);
  const state = useAtomValue(playerStateAtom);
  const repeatMode = useAtomValue(trackRepeatModeAtom);
  const autoPlay = useAtomValue(isAutoPlayEnabledAtom);

  async function pauseOrResume() {
    if (state === PlayerState.Playing) {
      await pauseTrack(token);
    } else {
      await resumeTrack(token);
    }
  }

  if (repeatMode === null)
    return (
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-[16px] w-[16px] rounded-full" />
        <Skeleton className="h-[32px] w-[20px] rounded-full" />
        <Skeleton className="h-[45px] w-[45px] rounded-full" />
        <Skeleton className="h-[32px] w-[20px] rounded-full" />
        <Skeleton className="h-[16px] w-[16px] rounded-full" />
      </div>
    );

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        {repeatMode === TrackRepeatMode.None && (
          <Tooltip>
            <TooltipTrigger>
              <IconRepeatOff
                size="1.2rem"
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className="transition-all duration-100 ease-in-out hover:text-white"
              />
            </TooltipTrigger>
            <TooltipContent>No repeat</TooltipContent>
          </Tooltip>
        )}
        {repeatMode === TrackRepeatMode.Track && (
          <Tooltip>
            <TooltipTrigger>
              <IconRepeatOnce
                size="1.2rem"
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className="transition-all duration-100 ease-in-out hover:text-white"
              />
            </TooltipTrigger>
            <TooltipContent>Repeating current track</TooltipContent>
          </Tooltip>
        )}
        {repeatMode === TrackRepeatMode.Queue && (
          <Tooltip>
            <TooltipTrigger>
              <IconRepeat
                size="1.2rem"
                color="white"
                role="button"
                onClick={async () =>
                  withNotification(await cycleRepeatMode(token))
                }
                className="transition-all duration-100 ease-in-out hover:text-white"
              />
            </TooltipTrigger>
            <TooltipContent>Repeating queue</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger>
            <IconPlayerSkipBackFilled
              size="1.5rem"
              color="white"
              role="button"
              onClick={async () => withNotification(await rewindTrack(token))}
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          </TooltipTrigger>
          <TooltipContent>Rewind</TooltipContent>
        </Tooltip>
        {state === PlayerState.Playing ? (
          <Tooltip>
            <TooltipTrigger>
              <IconPlayerPauseFilled
                color="white"
                size="2rem"
                role="button"
                onClick={pauseOrResume}
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </TooltipTrigger>
            <TooltipContent>Pause</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <IconPlayerPlayFilled
                color="white"
                size="2rem"
                role="button"
                onClick={pauseOrResume}
                className="transition-all duration-100 ease-in-out hover:text-gray-300"
              />
            </TooltipTrigger>
            <TooltipContent>Resume</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger>
            <IconPlayerSkipForwardFilled
              color="white"
              size="1.5rem"
              role="button"
              onClick={async () => withNotification(await skipTrack(token))}
              className="transition-all duration-100 ease-in-out hover:text-white"
            />
          </TooltipTrigger>
          <TooltipContent>Skip</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            {autoPlay ? (
              <IconRefreshDot
                size="1.2rem"
                color="white"
                role="button"
                className="transition-all duration-100 ease-in-out hover:text-white"
                onClick={async () =>
                  withNotification(await toggleAutoPlay(token))
                }
              />
            ) : (
              <IconRefreshOff
                size="1.2rem"
                color="white"
                role="button"
                className="transition-all duration-100 ease-in-out hover:text-white"
                onClick={async () =>
                  withNotification(await toggleAutoPlay(token))
                }
              />
            )}
          </TooltipTrigger>
          <TooltipContent>
            Autoplay {autoPlay ? "enabled" : "disabled"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
