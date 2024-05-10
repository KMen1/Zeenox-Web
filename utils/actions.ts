"use server";

import { db, discord, spotify, validateRequest } from "@/lib/auth";
import { SearchResult, SocketGuild } from "@/types/socket";
import {
  PlaylistsResponse,
  SearchResponse,
  TracksResponse,
} from "@/types/spotify";
import { getErrorMessageFromCode } from "@/utils/helpers";
import { DiscordTokens, SpotifyTokens } from "arctic";

type Result = {
  message: string;
  success: boolean;
};

const spotifyApiUrl = "https://api.spotify.com/v1";
const baseUrl = `${process.env.BOT_URL}/api/v1`;

export async function getAccessToken(
  userId: string,
  provider: "discord" | "spotify",
): Promise<string | null> {
  const [account] =
    await db`SELECT access_token, refresh_token, expires_at FROM oauth_account WHERE provider_id = ${provider} AND user_id = ${userId}`;

  if (!account) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (account.expires_at < now) {
    const refreshToken = account.refresh_token;

    let newTokens: DiscordTokens | SpotifyTokens;
    try {
      newTokens =
        provider === "discord"
          ? await discord.refreshAccessToken(refreshToken)
          : await spotify.refreshAccessToken(refreshToken);
    } catch (err: any) {
      await db`DELETE FROM oauth_account WHERE provider_id = ${provider} AND user_id = ${userId}`;
      return null;
    }

    const expiresAt = Math.floor(
      newTokens.accessTokenExpiresAt.getTime() / 1000,
    );

    await db`UPDATE oauth_account SET access_token = ${newTokens.accessToken}, expires_at = ${expiresAt}, refresh_token = ${newTokens.refreshToken} WHERE provider_id = ${provider} AND user_id = ${userId}`;
    return newTokens.accessToken;
  }

  return account.access_token;
}

export async function getAvailableGuilds(
  userId: string,
): Promise<SocketGuild[] | null> {
  const url = `${baseUrl}/guilds/available`;

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

export async function getGuild(guildId: string): Promise<SocketGuild | null> {
  const url = new URL(`${baseUrl}/guilds`);
  url.searchParams.set("id", guildId);
  const tempToken = await getBotToken("0", "0");
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
  return JSON.parse(data) as SocketGuild;
}

export async function getBotToken(
  userId: string,
  guildId: string,
): Promise<string | null> {
  const url = `${baseUrl}/identity`;

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

export async function fetchWithToken(
  url: string,
  token: string | null | undefined,
  method: string,
): Promise<Result> {
  if (!token) {
    return {
      message: "No token",
      success: false,
    };
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      message: res.ok ? await res.text() : getErrorMessageFromCode(res.status),
      success: res.ok,
    };
  } catch (err: any) {
    return {
      message: JSON.stringify(err),
      success: false,
    };
  }
}

export async function fetchJSON<T>(
  url: string,
  method: string,
  auth: string | null | undefined,
  revalidate: number = 600,
): Promise<T | null> {
  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    next: {
      revalidate: revalidate,
    },
  });

  if (!res.ok) {
    console.log(method, url, await res.text());
    return null;
  }

  const data = await res.json();
  return data as T;
}

export async function addTrack(
  trackUrl: string,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/add`);
  url.searchParams.set("url", trackUrl);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function playTrack(
  trackUrl: string,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/play`);
  url.searchParams.set("url", trackUrl);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function skipTrack(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/next`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function rewindTrack(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/rewind`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function pauseTrack(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/pause`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function resumeTrack(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/resume`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function stopTrack(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/stop`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function setVolume(
  token: string | null | undefined,
  volume: number,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/volume`);
  url.searchParams.set("volume", volume.toString());
  return fetchWithToken(url.toString(), token, "POST");
}

export async function moveTrack(
  from: number,
  to: number,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/move`);
  url.searchParams.set("from", from.toString());
  url.searchParams.set("to", to.toString());
  return fetchWithToken(url.toString(), token, "POST");
}

export async function removeTrack(
  index: number,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/removetrack`);
  url.searchParams.set("index", index.toString());
  return fetchWithToken(url.toString(), token, "POST");
}

export async function seekTrack(
  position: number,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/seek`);
  url.searchParams.set("position", position.toString());
  return fetchWithToken(url.toString(), token, "POST");
}

export async function skipToTrack(
  index: number,
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/skipTo`);
  url.searchParams.set("index", index.toString());
  return fetchWithToken(url.toString(), token, "POST");
}

export async function shuffleQueue(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/shuffle`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function clearQueue(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/clear`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function reverseQueue(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/reverse`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function distinctQueue(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/distinct`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function cycleRepeatMode(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/repeat`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function resumePreviousSession(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/resumesession`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function deletePreviousSession(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/resumesession`);
  return fetchWithToken(url.toString(), token, "DELETE");
}

export async function toggleAutoPlay(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/autoplay`);
  return fetchWithToken(url.toString(), token, "POST");
}

export async function getLyrics(
  token: string | null | undefined,
): Promise<Result> {
  const url = new URL(`${baseUrl}/player/lyrics`);
  return fetchWithToken(url.toString(), token, "GET");
}

export async function getLikedTracks(
  offset: number = 0,
): Promise<TracksResponse | null> {
  const url = new URL(`${spotifyApiUrl}/me/tracks`);
  url.searchParams.set("offset", offset.toString());
  url.searchParams.set("limit", "50");
  const { user } = await validateRequest();
  if (!user) return null;

  const accessToken = await getAccessToken(user.id, "spotify");
  const data = await fetchJSON<TracksResponse>(
    url.toString(),
    "GET",
    accessToken,
  );
  return data;
}

export async function getPlaylistTracks(
  id: string,
  offset: number = 0,
): Promise<TracksResponse | null> {
  if (id === "saved") return getLikedTracks(offset);

  const url = new URL(`${spotifyApiUrl}/playlists/${id}/tracks`);
  url.searchParams.set("offset", offset.toString());
  url.searchParams.set("limit", "50");
  const { user } = await validateRequest();
  if (!user) return null;

  const accessToken = await getAccessToken(user.id, "spotify");
  const data = await fetchJSON<TracksResponse>(
    url.toString(),
    "GET",
    accessToken,
  );
  return data;
}

export async function getSearchResults(
  query: string,
  offset: number = 0,
): Promise<SearchResponse | null> {
  const url = new URL(`${spotifyApiUrl}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("offset", offset.toString());
  url.searchParams.set("limit", "50");
  const { user } = await validateRequest();
  if (!user) return null;

  const accessToken = await getAccessToken(user.id, "spotify");
  const data = await fetchJSON<SearchResponse>(
    url.toString(),
    "GET",
    accessToken,
  );
  return data;
}

export async function getPlaylists(
  offset: number = 0,
): Promise<PlaylistsResponse | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const accessToken = await getAccessToken(user.id, "spotify");
  const url = new URL(`${spotifyApiUrl}/me/playlists`);
  url.searchParams.set("offset", offset.toString());
  const data = await fetchJSON<PlaylistsResponse>(
    url.toString(),
    "GET",
    accessToken,
  );
  return data;
}

export async function searchTracks(
  _prevState: any,
  formData: FormData,
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
