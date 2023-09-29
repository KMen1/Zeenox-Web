import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.endsWith("dashboard")) {
    const guildId = request.nextUrl.pathname.split("/")[2];
    const verified = await verifyToken(request, guildId);

    if (verified) {
      return NextResponse.next();
    }

    return fetchToken(request, guildId);
  }

  if (request.cookies.get("serverSessionToken")?.value) {
    const verified = await verifyToken(request);

    if (verified) {
      return NextResponse.next();
    }

    return fetchToken(request);
  }

  return fetchToken(request);
}

export const config = {
  matcher: "/dashboard/:path*",
};

async function verifyToken(request: NextRequest, id?: string) {
  const verifyRes = await fetch(
    `${process.env.BOT_URL}/api/v1/identity/verifytoken${
      id ? `?id=${id}` : ``
    }`,
    {
      headers: {
        Authorization: `Bearer ${
          request.cookies.get("serverSessionToken")?.value
        }`,
      },
    }
  );

  if (verifyRes.ok) {
    return true;
  }

  return false;
}

async function fetchToken(request: NextRequest, id?: string) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const tokenRes = await fetch(
    `${process.env.BOT_URL}/api/v1/identity/generatetoken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: token!.name,
        UserId: token!.sub,
        GuildId: id ?? 0,
        CustomClaims: {},
      }),
    }
  );

  const serverToken = await tokenRes.text();
  const response = NextResponse.next();
  response.cookies.set({
    name: "serverSessionToken",
    value: serverToken,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });

  return response;
}
