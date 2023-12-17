import { getSpotifyPlaylistTracks, getSpotifySavedTracks } from "@/app/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (id === "saved") {
    const tracks = await getSpotifySavedTracks(user.id);
    if (!tracks) {
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(JSON.stringify(tracks), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const tracks = await getSpotifyPlaylistTracks(user.id, id);
  if (!tracks) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify(tracks), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
