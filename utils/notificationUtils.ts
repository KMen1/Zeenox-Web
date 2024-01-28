import { notifications } from "@mantine/notifications";

export function showNotification(
  id: string,
  title: string,
  icon?: JSX.Element | null,
  loading?: boolean
) {
  notifications.show({
    id: id,
    loading: loading,
    title: title,
    color: "yellow",
    message: undefined,
    icon: icon,
    autoClose: false,
    withBorder: true,
    withCloseButton: false,
  });
}

export function updateNotification(
  id: string,
  title: string,
  icon: JSX.Element,
  color: string,
  message?: string
) {
  notifications.update({
    id: id,
    loading: false,
    title: title,
    color: color,
    message: message,
    icon: icon,
    autoClose: 4000,
    withCloseButton: true,
  });
}
