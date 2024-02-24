"use server";

import { AccessTokenResponse, Provider } from "@/types/clerk";
import { PartialGuild } from "@/types/discord";
import { SearchResult, SocketGuild } from "@/types/socket";

export async function getAccessToken(
  userId: string,
  provider: Provider
): Promise<string | null> {
  const url = `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/${provider}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
    next: {
      revalidate: 600,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as AccessTokenResponse[];
  const tokenToUse = data.find((token) => token.provider === provider);
  if (!tokenToUse) {
    return null;
  }
  return tokenToUse.token;
}

export async function searchTracks(
  _prevState: any,
  formData: FormData
): Promise<SearchResult | null> {
  const botToken = await getBotToken("0", "0");
  const query = formData.get("query") as string;
  const params = new URLSearchParams({ query });
  const url = `${process.env.BOT_URL}/api/v1/search?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${botToken}`,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

export async function getDiscordGuilds(
  userId: string
): Promise<PartialGuild[] | null> {
  const accessToken = await getAccessToken(userId, Provider.Discord);
  if (!accessToken) {
    return null;
  }

  const url = `https://discord.com/api/users/@me/guilds`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as PartialGuild[];
  return data;
}

export async function getAvailableGuilds(
  userId: string
): Promise<SocketGuild[] | null> {
  const url = `${process.env.BOT_URL}/api/v1/guilds/available`;

  const tempToken = await getBotToken(userId, "0");
  if (!tempToken) {
    return null;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken}`,
    },
    next: {
      revalidate: 0,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}

export async function getDiscordGuild(
  userId: string,
  guildId: string
): Promise<PartialGuild | null> {
  const accessToken = await getAccessToken(userId, Provider.Discord);
  if (!accessToken) {
    return null;
  }

  const url = `https://discord.com/api/users/@me/guilds/${guildId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as PartialGuild;
  return data;
}

export async function getBotToken(
  userId: string,
  guildId: string
): Promise<string | null> {
  const url = `${process.env.BOT_URL}/api/v1/identity`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserId: userId,
      GuildId: guildId,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.text();
  return data;
}
