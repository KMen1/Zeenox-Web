import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

const allowedActions = ["play", "pause", "stop", "next", "back"];

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  const session = await getServerSession(authOptions);
  const serverSessionToken = request.cookies.get("serverSessionToken");
  if (!session || !serverSessionToken) {
    return new Response("Unauthorized", { status: 403 });
  }

  const action = params.action;
  if (!allowedActions.includes(action)) {
    return new Response("Invalid action", { status: 400 });
  }

  let queryString = "";

  request.nextUrl.searchParams.forEach((value, key) => {
    if (queryString === "") queryString += "?";
    else queryString += "&";
    queryString += `${key}=${value}`;
  });

  const url = `${process.env.BOT_URL}/api/v1/player/${action}` + queryString;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverSessionToken.value}`,
      },
    });
    if (!response.ok) {
      return new Response(await response.text(), { status: 500 });
    } else {
      return new Response("OK", { status: 200 });
    }
  } catch (error: any) {
    return new Response("Internal server error", { status: 500 });
  }
}
