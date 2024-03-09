import { FastAverageColor, FastAverageColorResult } from "fast-average-color";

const fac = new FastAverageColor();

export function getAvgColor(
  document: Document,
  containerClass: string
): FastAverageColorResult | undefined {
  const container = document.querySelector(containerClass);
  if (container === null) return;

  const image = container.querySelector("img");
  if (image === null) return;

  const color = fac.getColor(image);
  return color;
}

export function getGradient(
  document: Document,
  containerClass: string,
  isDark: boolean,
  direction: "to top" | "to bottom" | "to left" | "to right" = "to bottom"
): string {
  const color = getAvgColor(document, containerClass);
  if (!color) return "none";

  const secondColor = isDark
    ? "rgba(255, 255, 255, 0.05) 100%)"
    : "rgba(0, 0, 0, 0.9) 100%)";
  return `linear-gradient(${direction}, ${color.rgba} 0%, ${secondColor}`;
}
