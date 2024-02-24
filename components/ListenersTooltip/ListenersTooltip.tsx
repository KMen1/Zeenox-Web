"use client";

import { listenersAtom } from "@/utils/atoms";
import { Avatar, Skeleton, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";

export function ListenersTooltip() {
  const listeners = useAtomValue(listenersAtom);

  if (!listeners) return <Skeleton w={20} h={5} />;

  return (
    <Tooltip.Group openDelay={100} closeDelay={100}>
      <Avatar.Group spacing="xs">
        {listeners.slice(0, 5).map((listener) => (
          <Tooltip key={listener.Username} label={listener.DisplayName}>
            <Avatar src={listener.AvatarUrl} radius="xl" size="xs" />
          </Tooltip>
        ))}
        {listeners.length > 5 && (
          <Tooltip
            label={
              <>
                {listeners.slice(5).map((listener) => (
                  <div key={listener.Username}>{listener.DisplayName}</div>
                ))}
              </>
            }
          >
            <Avatar radius="xl" size="xs">
              +{listeners.length - 5}
            </Avatar>
          </Tooltip>
        )}
      </Avatar.Group>
    </Tooltip.Group>
  );
}
