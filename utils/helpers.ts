export function toTime(seconds: number | null) {
  if (typeof seconds !== "number") return "0:00";
  const absSeconds = Math.abs(seconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor(absSeconds / 60) % 60;
  const sec = absSeconds % 60;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? `0${minutes}` : minutes
  }:${sec < 10 ? `0${sec}` : sec}`;
}

export function getErrorMessageFromCode(code: number) {
  switch (code) {
    case 400:
      return "Bad request";
    case 401:
      return "Session expired, please refresh the page!";
    case 403:
      return "Make sure you are in the same channel as the bot!";
    case 404:
      return "Player not found!";
    case 429:
      return "Slow down! Please wait a bit before trying again!";
    case 500:
      return "Something went wrong on our side!";
    default:
      return "Unknown error";
  }
}
