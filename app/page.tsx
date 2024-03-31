import { GuildPicker } from "@/features/guild-picker";
import { getAvailableGuilds } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs";
import { IconServer } from "@tabler/icons-react";

export default async function Home() {
  const user = await currentUser();
  const discordId = user?.externalAccounts.find(
    (a) => a.provider === "oauth_discord"
  )?.externalId;
  const guilds = user ? await getAvailableGuilds(discordId!) : null;

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <IconServer size={36} />
          <h2 className="text-xl">Please Select a Server</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <GuildPicker guilds={guilds ?? []} />
        </div>
      </div>
    </div>
  );
}
