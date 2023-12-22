import { Card, Flex } from "@mantine/core";
import { PlayerSongInfoDisplay } from "./PlayerSongInfoDisplay/PlayerSongInfoDisplay";
import { PlayerPositionSlider } from "./PlayerPositionSlider/PlayerPositionSlider";
import { PlayerControls } from "./PlayerControls/PlayerControls";
import { PlayerInfoDisplay } from "./PlayerInfoDisplay/PlayerInfoDisplay";

export function Player() {
  return (
    <Card shadow="xl" className="player-background">
      <Flex direction="column" justify="space-between" gap="sm">
        <PlayerSongInfoDisplay />
        <PlayerPositionSlider />
        <PlayerControls />
        <PlayerInfoDisplay />
      </Flex>
    </Card>
  );
}
