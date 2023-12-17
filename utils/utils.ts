import { FastAverageColor } from "fast-average-color";

export function GradientBackground(
  document: Document,
  containerClass: string,
  isDark: boolean
) {
  const fac = new FastAverageColor();
  const container = document.querySelector(containerClass);
  if (container === null) return;

  const image = container.querySelector("img");
  if (image === null) return;

  const color = fac.getColor(image);
  (container as HTMLElement).style.background =
    "linear-gradient(180deg, " +
    color.rgba +
    ` 0%, rgba(0,0,0,${isDark ? "0.5" : "0.9"}) 100%)`;
}

export function toTime(seconds: number | null) {
  if (!seconds) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const sec = seconds % 60;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? `0${minutes}` : minutes
  }:${sec < 10 ? `0${sec}` : sec}`;
}

export function toHumanTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours > 0 ? `${hours} hours ` : ""}${
    minutes > 0 ? `${minutes} minutes` : ""
  }`;
}

export function wrapPromise(promise: Promise<any>) {
  let status = "pending";
  let response: any;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );
  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
}

export function createQueryString(params: object | undefined) {
  let queryString = "";

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      queryString += `&${key}=${value}`;
    }
  }

  return queryString;
}
