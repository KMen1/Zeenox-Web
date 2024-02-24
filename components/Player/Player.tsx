import { Card, Flex } from "@mantine/core";
import { PlayerControls } from "./PlayerControls/PlayerControls";
import { PlayerInfoDisplay } from "./PlayerInfoDisplay/PlayerInfoDisplay";
import { PlayerPositionSlider } from "./PlayerPositionSlider/PlayerPositionSlider";
import { PlayerSongInfoDisplay } from "./PlayerSongInfoDisplay/PlayerSongInfoDisplay";

export function Player() {
  return (
    <Card
      shadow="xl"
      className="player-background"
      style={{ maxWidth: "230px" }}
    >
      <Flex direction="column" justify="space-between" gap="sm">
        <PlayerSongInfoDisplay />
        <PlayerPositionSlider size="md" />
        <PlayerControls size="md" />
        <PlayerInfoDisplay />
      </Flex>
    </Card>
  );
}
