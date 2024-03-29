import { Box, Card, Group, Text } from "@mantine/core";
import classes from "./ContentCard.module.css";

type ContentCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  rightSection?: React.ReactNode;
  bg?: string;
};

export function ContentCard({
  title,
  icon,
  children,
  rightSection,
  bg,
}: ContentCardProps) {
  return (
    <Box px="md" pb="md" className={classes.card}>
      <Group py="sm" justify="space-between">
        <Group gap={10}>
          {icon}
          <Text>{title}</Text>
        </Group>
        {rightSection}
      </Group>
      <Card className={classes.content} bg={bg}>
        {children}
      </Card>
    </Box>
  );
}
