import { SocketGuild } from "@/types/socket";
import { GuildCard } from "./GuildCard";

type GuildPickerProps = {
  guilds: SocketGuild[];
};

export function GuildPicker({ guilds }: GuildPickerProps) {
  return guilds.map((guild) => <GuildCard key={guild.Id} guild={guild} />);
}
