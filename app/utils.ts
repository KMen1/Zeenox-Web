"use server";

import { AccessTokenResponse, Provider } from "@/types/clerk";
import { PartialGuild } from "@/types/discord";
import {
  Playlist,
  PlaylistsResponse,
  SavedTracksResponse,
  Track,
} from "@/types/spotify";

async function getAccessToken(
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

export async function getSpotifyPlaylists(
  userId: string
): Promise<Playlist[] | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = "https://api.spotify.com/v1/me/playlists";

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

  const data = (await res.json()) as PlaylistsResponse;
  let playlists = data.items;
  let next = data.next;
  if (next) {
    while (next) {
      const nextRes = await fetch(next, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 300,
        },
      });
      const nextData = (await nextRes.json()) as PlaylistsResponse;
      playlists = playlists.concat(nextData.items);
      next = nextData.next;
    }
  }

  return playlists;
}

export async function getSpotifySavedTracksResponse(
  userId: string,
  offset: number = 0
): Promise<SavedTracksResponse | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`;

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

  const data = (await res.json()) as SavedTracksResponse;
  return data;
}

export async function getSpotifySavedTracks(
  userId: string
): Promise<Track[] | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = "https://api.spotify.com/v1/me/tracks?limit=50";

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
  const data = (await res.json()) as SavedTracksResponse;
  let tracks = data.items;
  let next = data.next;
  if (next) {
    while (next) {
      const nextRes = await fetch(next, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 300,
        },
      });
      const nextData = await nextRes.json();
      tracks = tracks.concat(nextData.items);
      next = nextData.next;
    }
  }

  return tracks.map((track) => track.track);
}

export async function getSpotifySearchResults(
  userId: string,
  query: string,
  offset: number = 0
): Promise<SavedTracksResponse | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&offset=${offset}&limit=50`;

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
  const data = (await res.json()) as SavedTracksResponse;
  return data;
}

export async function getSpotifyPlaylistTracksResponse(
  userId: string,
  playlistId: string,
  offset: number = 0
): Promise<SavedTracksResponse | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=50`;

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
  const data = (await res.json()) as SavedTracksResponse;
  return data;
}

export async function getSpotifyPlaylistTracks(
  userId: string,
  playlistId: string
): Promise<Track[] | null> {
  const accessToken = await getAccessToken(userId, Provider.Spotify);
  if (!accessToken) {
    return null;
  }

  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

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
  const data = (await res.json()) as SavedTracksResponse;
  let tracks = data.items;
  let next = data.next;
  if (next) {
    while (next) {
      const nextRes = await fetch(next, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 300,
        },
      });
      const nextData = await nextRes.json();
      tracks = tracks.concat(nextData.items);
      next = nextData.next;
    }
  }

  return tracks.map((track) => track.track);
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

export async function getSocketSessionToken(
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
