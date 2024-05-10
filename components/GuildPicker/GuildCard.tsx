"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SocketGuild } from "@/types/socket";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Track } from "../Track/Track";

type GuildCardProps = {
  guild: SocketGuild;
};

export function GuildCard({ guild }: GuildCardProps) {
  const iconUrl = guild.IconUrl || "/placeholder-guild.jpg";
  const isConnected = guild.ConnectedVoiceChannel !== null;
  const isPlaying = guild.CurrentTrack !== null;

  return (
    <div
      key={guild.Id}
      className={`guildcard-${guild.Id} rounded-xl bg-muted p-4`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-nowrap items-center gap-2">
          <Image
            src={iconUrl}
            alt={guild.Name}
            crossOrigin="anonymous"
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <h2 className="line-clamp-1 text-lg" title={guild.Name}>
            {guild.Name}
          </h2>
        </div>
        <Separator />
        {isPlaying && <Track track={guild.CurrentTrack!} mode="none" />}
        {!isPlaying && (
          <div className="flex flex-col gap-1 px-2">
            <div className="flex items-center gap-2">
              <IconDeviceFloppy />
              <p className={`text-sm`}>
                {guild.ResumeSession
                  ? "Previous session can be resumed!"
                  : "No resume session available!"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IconAlertTriangle />
              <p className={`text-sm`}>Join a channel before starting!</p>
            </div>
          </div>
        )}
        <Button variant="default" asChild>
          <Link href={`/dashboard/${guild.Id}`}>
            <div className="flex items-center gap-2">
              {isPlaying || isConnected ? "Connect" : "Start new session"}
              <IconArrowRight size={14} />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
