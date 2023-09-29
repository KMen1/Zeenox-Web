"use client";

import Image from "next/image";
import { useCurrentTrack } from "../CurrentTrackProvider";
import { FastAverageColor } from "fast-average-color";
import { useCallback } from "react";

function Color(document: Document) {
  const fac = new FastAverageColor();
  const container = document.querySelector(".player-background")!;
  const color = fac.getColor(container.querySelector("img"));
  (container as HTMLElement).style.background =
    "linear-gradient(180deg, " + color.rgba + " 0%, rgba(0,0,0,0.5) 100%)";
}

export default function PlayerWidgetAlbumArt() {
  const trackData = useCurrentTrack();
  const calcColor = useCallback(() => Color(document), []);
  return (
    <Image
      priority
      src={
        trackData.Thumbnail === "" || null
          ? "/placeholder-album.jpeg"
          : trackData.Thumbnail!
      }
      alt={trackData.Title}
      width={400}
      height={400}
      style={{ borderRadius: "0.15rem" }}
      onLoad={calcColor}
    />
  );
}
