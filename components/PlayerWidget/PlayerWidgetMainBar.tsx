import { Flex } from "@mantine/core";
import PlayerWidgetTitleAuthor from "./PlayerWidgetTitleAuthor";
import PlayerWidgetLikeSong from "./PlayerWidgetLikeSong";

export default function PlayerWidgetMainBar() {
  return (
    <Flex direction="row" justify="space-between" align="center">
      <PlayerWidgetTitleAuthor />
      <PlayerWidgetLikeSong />
    </Flex>
  );
}
