import { authOptions } from "@/auth";
import { Title, Card, Group } from "@mantine/core";
import { getServerSession } from "next-auth";
import { UserDisplay } from "../UserDisplay.tsx/UserDisplay";
import { SignInDisplay } from "../SignInDisplay/SignInDisplay";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <Card
      withBorder
      shadow="md"
      p="xs"
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0,
      }}
    >
      <Group justify="space-between">
        <Title size="lg">Zeenox</Title>
        {user ? <UserDisplay user={user} /> : <SignInDisplay />}
      </Group>
    </Card>
  );
}
