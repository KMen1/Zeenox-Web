"use client";

import { Track } from "@/components/Track/Track";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  currentTrackAtom,
  resumeSessionAtom,
  selectedAtom,
  trackColorAtom,
} from "@/stores/atoms";
import { darken, getAvgColor, luminance } from "@/utils/colorHelpers";
import {
  IconClockPlay,
  IconLayoutList,
  IconMicrophone2,
  IconTrash,
} from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import { useCallback } from "react";
import Marquee from "react-fast-marquee";
import { PlayerControls } from "./PlayerControls";
import { PlayerPositionSlider } from "./PlayerPositionSlider";
import { PlayerVolumeSlider } from "./PlayerVolumeSlider";

export function PlayerPanel() {
  const track = useAtomValue(currentTrackAtom);
  const [color, setColor] = useAtom(trackColorAtom);
  const [selectedPanel, setSelectedPanel] = useAtom(selectedAtom);
  const resumeSession = useAtomValue(resumeSessionAtom);

  const handleColorChange = useCallback(() => {
    const color = getAvgColor(document, ".player2-background")?.value;
    const rgba = `rgba(${color?.[0]}, ${color?.[1]}, ${color?.[2]}, 1)`;
    setColor(color ? rgba : "black");

    const cLuminance = luminance(color![0], color![1], color![2]);
    const tLuminance = 1;

    const contrast = (tLuminance + 0.05) / (cLuminance + 0.05);
    if (contrast < 4.5) {
      const darkenAmount = 0.5 - contrast / 10;
      const newColor = darken(rgba, darkenAmount);
      setColor(newColor);
    }
  }, [setColor]);

  return (
    <div
      className="player2-background relative bottom-0 flex flex-col rounded-xl p-4"
      style={{ background: color }}
    >
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start">
          <div className="flex flex-nowrap gap-4">
            <Image
              src={track?.ArtworkUrl || "/placeholder-album.jpeg"}
              width={64}
              height={64}
              alt={track?.Title || "No track playing"}
              crossOrigin="anonymous"
              onLoad={handleColorChange}
              style={{ borderRadius: "0.4rem" }}
            />
            <div className="flex flex-col justify-center gap-1">
              <Marquee pauseOnHover delay={15} speed={25}>
                <a
                  href={track?.Url!}
                  target="_blank"
                  title={track?.Title}
                  className="line-clamp-1 cursor-pointer text-xl font-semibold text-white hover:underline"
                >
                  {track?.Title || "No track playing"}
                </a>
              </Marquee>

              <span
                className="line-clamp-1 text-sm text-neutral-200"
                title={track?.Author}
              >
                {track?.Author || "No author"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-1 justify-center">
          <div className="flex w-full flex-col gap-2">
            <PlayerControls />
            <PlayerPositionSlider />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-2">
            {resumeSession && (
              <Dialog>
                <DialogTrigger asChild>
                  <IconClockPlay size={18} role="button" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resume Available!</DialogTitle>
                    <DialogDescription>
                      Seems like the last session in this server was not fully
                      finished and has been saved automatically!
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <h3>The following will be played</h3>
                    <Track track={resumeSession.CurrentTrack} mode="none" />
                  </div>
                  <div>
                    <h3>The following will be added to the queue</h3>
                    {resumeSession.QueueLength > 0 ? (
                      <div className="flex flex-col">
                        {resumeSession.UpcomingFewTracks.map((track) => (
                          <Track key={track.Url} track={track} mode="none" />
                        ))}
                        {resumeSession.QueueLength >
                        resumeSession.UpcomingFewTracks.length ? (
                          <span className="text-right">
                            and{" "}
                            {resumeSession.QueueLength -
                              resumeSession.UpcomingFewTracks.length}{" "}
                            more...
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <DialogFooter>
                    <Button variant="destructive">
                      <div className="flex gap-2">
                        <IconTrash size={20} />
                        Delete Session
                      </div>
                    </Button>
                    <Button variant="default">
                      <div className="flex gap-2">
                        <IconClockPlay size={20} />
                        Resume Session
                      </div>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <IconLayoutList
              size={18}
              role="button"
              color={selectedPanel === "actions" ? "black" : "white"}
              onClick={() => setSelectedPanel("actions")}
            />
            <IconMicrophone2
              size={18}
              role="button"
              color={selectedPanel === "lyrics" ? "black" : "white"}
              onClick={() => setSelectedPanel("lyrics")}
            />

            <PlayerVolumeSlider />
          </div>
        </div>
      </div>
    </div>
  );
}
