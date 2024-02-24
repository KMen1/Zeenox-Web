import { notifications } from "@mantine/notifications";
import { IconBug } from "@tabler/icons-react";

type Result = {
  message: string;
  success: boolean;
};

export function withNotification(result: Result): Result {
  if (!result.success) {
    notifications.show({
      id: Math.random().toString(),
      title: "Error",
      color: "red",
      message: result.message || "An error occurred",
      icon: <IconBug width="70%" height="70%" />,
      autoClose: 2000,
      withBorder: true,
    });
  }

  return result;
}
