import { SignedIn, UserButton } from "@clerk/nextjs";
import { Box, Card, Group, Title } from "@mantine/core";
import classes from "./Navbar.module.css";
import { NavbarBackButton } from "./NavbarBackButton";

export async function Navbar() {
  return (
    <Card py="xs" pl="lg" className={classes.header}>
      <Group justify="space-between">
        <Box style={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>
          <Group gap={0}>
            <Title size="lg" pr="sm">
              Zeenox
            </Title>
            <NavbarBackButton />
          </Group>
        </Box>
        <Box style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Group>
    </Card>
  );
}
