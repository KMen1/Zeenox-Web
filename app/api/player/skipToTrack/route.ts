import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new Response("Invalid token", { status: 400 });
  }

  const index = request.nextUrl.searchParams.get("index");
  const reqUrl = `${process.env.BOT_URL}/api/v1/player/skipto?index=${index}`;

  try {
    const res = await fetch(reqUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return new Response(await res.text(), { status: 500 });
    } else {
      return new Response("OK", { status: 200 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
}
