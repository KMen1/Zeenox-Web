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

export function luminance(R8bit: number, G8bit: number, B8bit: number) {
  const RsRGB = R8bit / 255;
  const GsRGB = G8bit / 255;
  const BsRGB = B8bit / 255;

  const R =
    RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  const G =
    GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  const B =
    BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return L;
}

export function darken(color: string, amount: number) {
  const rgb = color.match(/\d+/g);
  if (!rgb) return color;

  const r = Math.max(0, parseInt(rgb[0], 10) - amount * 255);
  const g = Math.max(0, parseInt(rgb[1], 10) - amount * 255);
  const b = Math.max(0, parseInt(rgb[2], 10) - amount * 255);
  return `rgb(${r}, ${g}, ${b})`;
}

export function lighten(color: string, amount: number) {
  const rgb = color.match(/\d+/g);
  if (!rgb) return color;

  const r = Math.min(255, parseInt(rgb[0], 10) + amount * 255);
  const g = Math.min(255, parseInt(rgb[1], 10) + amount * 255);
  const b = Math.min(255, parseInt(rgb[2], 10) + amount * 255);
  return `rgb(${r}, ${g}, ${b})`;
}
