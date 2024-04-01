import { db, discord, lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { parseCookies } from "oslo/cookie";

export async function GET(request: Request) {
  const cookies = parseCookies(request.headers.get("Cookie") ?? "");
  const stateCookie = cookies.get("discord_oauth_state") ?? null;

  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (!state || !stateCookie || !code || stateCookie !== state) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordUserRes = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const discordUser: DiscordUserResult = await discordUserRes.json();
    const expiresAt = Math.floor(tokens.accessTokenExpiresAt.getTime() / 1000);

    const [existingAccount] =
      await db`SELECT * FROM oauth_account WHERE provider_id = 'discord' AND provider_user_id = ${discordUser.id}`;

    if (existingAccount) {
      const session = await lucia.createSession(existingAccount.user_id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    }

    const userId = generateId(15);

    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
    await db`INSERT INTO "auth_user" (id, username, avatar_url) VALUES (${userId}, ${discordUser.username}, ${avatarUrl})`;
    await db`INSERT INTO "oauth_account" (provider_id, provider_user_id, user_id, access_token, refresh_token, expires_at) VALUES ('discord', ${discordUser.id}, ${userId}, ${tokens.accessToken}, ${tokens.refreshToken}, ${expiresAt})`;

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
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

interface DiscordUserResult {
  id: number;
  username: string;
  avatar: string;
}
