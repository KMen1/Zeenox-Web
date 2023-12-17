import { getSpotifySearchResults } from "@/app/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (query === null) {
    return new Response("Bad Request", { status: 400 });
  }
  const user = await currentUser();
  const offset = Number(request.nextUrl.searchParams.get("offset"));

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await getSpotifySearchResults(user.id, query, offset);
  if (!response) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
