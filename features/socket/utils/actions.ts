"use server";

import { fetchJSON } from "@/utils/actions";
import {
  ActionsResponse,
  CurrentTrackResponse,
  PlayerResponse,
  PlayerStateResponse,
  QueueResponse,
  SessionDataResponse,
} from "../types/responses";
import { PayloadType } from "../types/socket";

const baseUrl = `${process.env.BOT_URL}/api/v1`;

export async function getSessionData(
  token: string | null | undefined,
  type: PayloadType
): Promise<SessionDataResponse> {
  return fetchJSON(`${baseUrl}/player/options?type=${type}`, "GET", token, 0);
}

export async function getPlayer(
  token: string | null | undefined
): Promise<PlayerResponse> {
  return fetchJSON(`${baseUrl}/player`, "GET", token, 0);
}

export async function getPlayerState(
  token: string | null | undefined
): Promise<PlayerStateResponse> {
  return fetchJSON(`${baseUrl}/player/state`, "GET", token, 0);
}

export async function getCurrentTrack(
  token: string | null | undefined
): Promise<CurrentTrackResponse> {
  return fetchJSON(`${baseUrl}/player/current`, "GET", token, 0);
}

export async function getQueue(
  token: string | null | undefined
): Promise<QueueResponse> {
  return fetchJSON(`${baseUrl}/player/queue`, "GET", token, 0);
}

export async function getActions(
  token: string | null | undefined
): Promise<ActionsResponse> {
  const url = new URL(`${baseUrl}/player/actions`);
  return fetchJSON(url.toString(), "GET", token, 0);
}
