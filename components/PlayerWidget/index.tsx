import { Card, Flex } from "@mantine/core";
import PlayerWidgetMainBar from "./PlayerWidgetMainBar";
import PlayerWidgetAlbumArt from "./PlayerWidgetAlbumArt";
import PlayerWidgetPositionSlider from "./PlayerWidgetPositionSlider";
import PlayerWidgetControls from "./PlayerWidgetControls";
import PlayerWidgetRequester from "./PlayerWidgetRequester";

export function toTime(seconds: number | null) {
  if (!seconds) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const sec = seconds % 60;
  return `${hours > 0 ? `${hours}:` : ""}${
    minutes < 10 && hours > 0 ? `0${minutes}` : minutes
  }:${sec < 10 ? `0${sec}` : sec}`;
}

export default function PlayerWidget() {
  return (
    <Card shadow="md" className="player-background" maw={210} withBorder>
      <Flex direction="column" justify="space-between" gap="sm">
        <PlayerWidgetAlbumArt />
        <PlayerWidgetMainBar />
        <PlayerWidgetPositionSlider />
        <PlayerWidgetControls />
        <PlayerWidgetRequester />
      </Flex>
    </Card>
  );
}
