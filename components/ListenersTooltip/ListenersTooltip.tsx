"use client";

import { Tooltip, Avatar } from "@mantine/core";
import { useChannelInfo } from "../Providers/ChannelInfoProvider";

export default function ListenersTooltip() {
  const { Listeners } = useChannelInfo();

  return (
    <Tooltip.Group openDelay={100} closeDelay={100}>
      <Avatar.Group spacing="xs">
        {Listeners.slice(0, 5).map((listener) => (
          <Tooltip
            key={listener.Username}
            label={`${listener.DisplayName} (${listener.Username})`}
            withArrow
          >
            <Avatar src={listener.AvatarUrl} radius="xl" size="xs" />
          </Tooltip>
        ))}
        {Listeners.length > 5 && (
          <Tooltip
            withArrow
            label={
              <>
                {Listeners.slice(5).map((listener) => (
                  <div key={listener.Username}>
                    {listener.DisplayName} ({listener.Username})
                  </div>
                ))}
              </>
            }
          >
            <Avatar radius="xl" size="xs">
              +{Listeners.length - 5}
            </Avatar>
          </Tooltip>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
