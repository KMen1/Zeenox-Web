import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocketUser } from "@/types/socket";
import TimeAgo from "react-timeago";

type ActionCardProps = {
  title: string;
  user: SocketUser;
  timestampMs: number;
  bgImage?: string;
  children: React.ReactNode;
};

export function ActionCard({
  title,
  user,
  timestampMs,
  bgImage,
  children,
}: ActionCardProps) {
  const time = new Date(timestampMs * 1000);

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
          {children}
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
