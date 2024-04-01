import { db, lucia, spotify } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { parseCookies } from "oslo/cookie";

export async function GET(request: Request) {
  const reqCookies = parseCookies(request.headers.get("Cookie") ?? "");
  const stateCookie = reqCookies.get("spotify_oauth_state") ?? null;

  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!state || !stateCookie || !code || stateCookie !== state) {
    return new Response(null, {
      status: 400,
    });
  }

  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return new Response(null, {
      status: 401,
    });
  }

  const { user } = await lucia.validateSession(sessionId);
  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const spotifyUser = (await userResponse.json()) as SpotifyUserResult;
    const expiresAt = Math.floor(tokens.accessTokenExpiresAt.getTime() / 1000);

    const [alreadyLinked] =
      await db`SELECT * FROM oauth_account WHERE provider_id = 'spotify' AND provider_user_id = ${spotifyUser.id} AND user_id = ${user.id}`;

    if (!alreadyLinked) {
      await db`INSERT INTO "oauth_account" (provider_id, provider_user_id, user_id, access_token, refresh_token, expires_at) VALUES ('spotify', ${spotifyUser.id}, ${user.id}, ${tokens.accessToken}, ${tokens.refreshToken}, ${expiresAt})`;
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface SpotifyUserResult {
  id: string;
  display_name: string;
  images: { url: string }[];
}
