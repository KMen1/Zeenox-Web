export function toTime(seconds: number | null) {
  if (!seconds) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const sec = seconds % 60;
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
