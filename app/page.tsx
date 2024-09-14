import { GuildPicker } from "@/components/GuildPicker/GuildPicker";
import { validateRequest } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getAvailableGuilds } from "@/utils/actions";
import { IconServer } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/api/login/discord");
  }

  const [discord] =
    await sql`SELECT * FROM oauth_account WHERE provider_id = 'discord' AND user_id = ${user.id}`;

  const discordId = discord?.provider_user_id;
  const guilds = user ? await getAvailableGuilds(discordId!) : null;

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex h-full flex-col gap-4">
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
