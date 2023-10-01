"use client";

import { Tooltip, Avatar } from "@mantine/core";
import { useListeners } from "../ListenersProvider";

export function ListenerDisplay() {
  const listeners = useListeners();

  return (
    <Tooltip.Group openDelay={100} closeDelay={100}>
      <Avatar.Group spacing="sm">
        {listeners.slice(0, 5).map((listener) => (
          <Tooltip
            key={listener.Username}
            label={`${listener.DisplayName} (${listener.Username})`}
            withArrow
          >
            <Avatar src={listener.AvatarUrl} radius="xl" size="sm" />
          </Tooltip>
        ))}
        {listeners.length > 5 && (
          <Tooltip
            withArrow
            label={
              <>
                {listeners.slice(5).map((listener) => (
                  <div key={listener.Username}>
                    {listener.DisplayName} ({listener.Username})
                  </div>
                ))}
              </>
            }
          >
            <Avatar radius="xl" size="sm">
              +{listeners.length - 5}
            </Avatar>
          </Tooltip>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
