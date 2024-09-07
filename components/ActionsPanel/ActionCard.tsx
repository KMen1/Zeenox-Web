import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Action,
  ActionType,
  AddPlaylistAction,
  AddTrackAction,
  PlayAction,
  SkipAction,
} from "@/types/playerActions";
import TimeAgo from "react-timeago";
import { Playlist } from "../Playlist/Playlist";
import { Track } from "../Track/Track";

function getImage(action: Action): string | undefined {
  switch (action.Type) {
    case ActionType.AddTrack:
    case ActionType.RemoveTrack:
    case ActionType.MoveTrack:
      return (action as AddTrackAction).Track.ArtworkUrl || undefined;
    case ActionType.AddPlaylist:
      return (
        (action as AddPlaylistAction).Playlist?.ArtworkUrl ||
        (action as AddPlaylistAction).Tracks[0]?.ArtworkUrl ||
        undefined
      );
    case ActionType.Play:
    case ActionType.Skip:
    case ActionType.SkipTo:
    case ActionType.Rewind:
      return (action as PlayAction).Track.ArtworkUrl ?? undefined;
    default:
      return undefined;
  }
}

function getChildren(action: Action): React.ReactNode | null {
  switch (action.Type) {
    case ActionType.AddPlaylist:
      const data = action as AddPlaylistAction;
      return <Playlist playlist={data} transparent expandable />;
    case ActionType.Play:
    case ActionType.Rewind:
    case ActionType.AddTrack:
    case ActionType.RemoveTrack:
    case ActionType.MoveTrack:
      const track = (action as PlayAction).Track;
      return <Track track={track} transparent hoverable mode="play" withAdd />;
    case ActionType.Skip:
    case ActionType.SkipTo:
      const skipPayload = action as SkipAction;
      const track1 = skipPayload.Track;
      const prevTrack = skipPayload.PreviousTrack;
      return (
        <>
          <Track track={track1} transparent hoverable mode="play" withAdd />
          <span className="lead line-clamp-1 font-semibold text-white">
            Skipped
          </span>
          <Track track={prevTrack} transparent hoverable mode="play" withAdd />
        </>
      );
    default:
      return null;
  }
}

type ActionCardProps = {
  action: Action;
};

export function ActionCard({ action }: ActionCardProps) {
  if (!action) return null;

  const title = action.Message;
  const timestampMs = action.Timestamp;
  const user = action.User;
  const time = new Date(timestampMs * 1000);
  const bgImage = getImage(action);

  return (
    <div className="relative w-full min-w-[200px]">
      <div
        className="absolute bottom-0 left-0 right-0 top-0 rounded-xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute h-full w-full rounded-xl bg-[rgba(0,0,0,0.4)] backdrop-blur-md" />
      <div
        className={`relative rounded-xl border p-5 ${
          !!bgImage ? "bg-[rgba(0,0,0,0.6)]" : "bg-black"
        }`}
      >
        <div className="flex flex-col gap-1">
          <p className="text-lg font-bold">{title}</p>
          {getChildren(action)}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.AvatarUrl ?? ""} />
              </Avatar>
              <span className="text-xs">{user.DisplayName}</span>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs">
                  <TimeAgo
                    date={time}
                    formatter={(value, unit) => {
                      if (unit === "second" && value < 5) {
                        return "just now";
                      }
                      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
                    }}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>{time.toLocaleTimeString()}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
