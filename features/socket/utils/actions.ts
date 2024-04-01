"use server";

import { fetchJSON } from "@/utils/actions";
import { PlayerResponse, SessionDataResponse } from "../types/responses";
import { PayloadType } from "../types/socket";

const baseUrl = `${process.env.BOT_URL}/api/v1`;

export async function getSessionData(
  token: string | null | undefined,
  type: PayloadType,
): Promise<SessionDataResponse | null> {
  return fetchJSON(`${baseUrl}/player/options?type=${type}`, "GET", token, 0);
}

export async function getPlayer(
  token: string | null | undefined,
): Promise<PlayerResponse | null> {
  return fetchJSON(`${baseUrl}/player`, "GET", token, 0);
}
