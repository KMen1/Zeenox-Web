import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const serverSessionToken = request.cookies.get("serverSessionToken");
  if (!serverSessionToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const guildsRes = await fetch(
      `${process.env.BOT_URL}/api/v1/guilds/available`,
      {
        headers: {
          Authorization: `Bearer ${serverSessionToken.value}`,
        },
      }
    );
    if (!guildsRes.ok) {
      return new Response(await guildsRes.text(), { status: 500 });
    }
    return Response.json(await guildsRes.json());
  } catch (error: any) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
}
