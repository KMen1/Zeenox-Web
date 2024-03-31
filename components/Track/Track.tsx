"use client";

import { botTokenAtom } from "@/stores/atoms";
import { Track } from "@/types/socket";
import { toTime } from "@/utils/helpers";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import {
  IconGripVertical,
  IconPlayerPlayFilled,
  IconRefreshDot,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import {
  addTrack,
  moveTrack,
  playTrack,
  removeTrack,
  skipToTrack,
} from "../../utils/actions";
import { withNotification } from "../../utils/withNotification";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type TrackProps = {
  track: Track;
  index?: number;
  hoverable?: boolean;
  transparent?: boolean;
  mode: "play" | "skipTo" | "none";
  showRequestedBy?: boolean;
  withAdd?: boolean;
  withRemove?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export function Track({
  track,
  index,
  hoverable,
  transparent,
  mode = "none",
  showRequestedBy,
  withAdd,
  withRemove,
  dragHandleProps,
}: TrackProps) {
  const token = useAtomValue(botTokenAtom);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`group flex flex-nowrap items-center gap-2 rounded px-2 py-1 duration-75 ease-in-out ${
            hoverable
              ? transparent
                ? "hover:bg-[rgba(255,255,255,0.1)]"
                : "hover:bg-neutral-900"
              : ""
          }`}
          data-hoverable={hoverable}
          data-transparent={transparent}
        >
          {dragHandleProps && (
            <div {...dragHandleProps}>
              <IconGripVertical size={15} />
            </div>
          )}
          <div className="relative min-h-[36px] min-w-[36px]">
            <Image
              src={
                track?.ArtworkUrl ??
                "https://misc.scdn.co/liked-songs/liked-songs-640.png"
              }
              width={36}
              height={36}
              className={`absolute left-0 top-0 rounded transition-all duration-100 ease-in-out group-hover:brightness-50`}
              alt={track?.Title ?? "Nothing here"}
            />
            {track && mode !== "none" && (
              <div className="absolute left-[.5rem] top-[.5rem]">
                <Tooltip>
                  <TooltipTrigger>
                    <IconPlayerPlayFilled
                      role="button"
                      size="1.2rem"
                      className="text-white opacity-0 transition-all duration-100 ease-in-out hover:text-neutral-400 group-hover:opacity-100"
                      onClick={
                        mode === "skipTo"
                          ? async () =>
                              withNotification(await skipToTrack(index!, token))
                          : async () =>
                              withNotification(
                                await playTrack(track.Url ?? "", token),
                              )
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`Play ${track.Title} by ${track.Author}`}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <a
              className="line-clamp-1 text-[.9rem] font-medium text-foreground hover:underline"
              href={track?.Url!}
              target="_blank"
              title={track?.Title}
            >
              {track?.Title}
            </a>
            <p
              className="line-clamp-1 text-[.8rem] font-normal text-foreground text-neutral-400"
              title={track?.Author}
            >
              {track?.Author}
            </p>
          </div>

          <div className="flex min-w-max flex-1 items-center justify-end gap-2">
            <p className="text-[.8rem] text-neutral-400">
              {toTime(Math.round(track?.Duration / 1000))}
            </p>

            {track?.RequestedBy !== null && showRequestedBy && (
              <Tooltip>
                <TooltipTrigger>
                  <Image
                    src={track.RequestedBy.AvatarUrl ?? "/placeholder-user.png"}
                    width={15}
                    height={15}
                    alt={track.RequestedBy.DisplayName}
                    style={{ borderRadius: "50%" }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{track.RequestedBy.DisplayName}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {track?.RequestedBy === null && mode === "skipTo" && (
              <Tooltip>
                <TooltipTrigger>
                  <IconRefreshDot size={15} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>From autoplay</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          inset
          onClick={async () =>
            withNotification(await playTrack(track.Url ?? "", token))
          }
        >
          Play
        </ContextMenuItem>
        <ContextMenuItem
          inset
          disabled={mode !== "skipTo"}
          onClick={async () =>
            withNotification(await skipToTrack(index!, token))
          }
        >
          Skip to song
        </ContextMenuItem>
        <ContextMenuItem
          inset
          disabled={!withAdd}
          onClick={async () =>
            withNotification(await addTrack(track.Url ?? "", token))
          }
        >
          Add to queue
        </ContextMenuItem>
        <ContextMenuItem
          inset
          disabled={!withRemove}
          onClick={async () =>
            withNotification(await removeTrack(index!, token))
          }
        >
          Remove from queue
        </ContextMenuItem>
        <ContextMenuItem
          inset
          disabled={index === undefined}
          onClick={async () =>
            withNotification(await moveTrack(index!, 0, token))
          }
        >
          Move to top
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
