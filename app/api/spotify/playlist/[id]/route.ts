import {
  getSpotifyPlaylistTracksResponse,
  getSpotifySavedTracksResponse,
} from "@/app/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const user = await currentUser();
  const offset = Number(request.nextUrl.searchParams.get("offset"));

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (id === "saved") {
    const response = await getSpotifySavedTracksResponse(user.id, offset);
    if (!response) {
      return new Response("Unauthorized", { status: 401 });
    }
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await getSpotifyPlaylistTracksResponse(user.id, id, offset);
  if (!response) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
