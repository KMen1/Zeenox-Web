import { spotify } from "@/lib/auth";
import { generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";

export async function GET() {
  const state = generateState();
  const url = await spotify.createAuthorizationURL(state, {
    scopes: ["user-read-email", "playlist-read-private", "user-library-read"],
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": serializeCookie("spotify_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
      }),
    },
  });
}
