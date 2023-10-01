import { authOptions } from "@/auth";
import { Title, Card, Group } from "@mantine/core";
import { getServerSession } from "next-auth";
import { UserDisplay } from "../UserDisplay.tsx/UserDisplay";
import { SignInDisplay } from "../SignInDisplay/SignInDisplay";
import Link from "next/link";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <Card
      withBorder
      shadow="md"
      p="6"
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderRadius: 0,
      }}
    >
      <Group justify="space-between">
        <Group>
          <Title size="lg">Zeenox</Title>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
        </Group>
        {user ? <UserDisplay user={user} /> : <SignInDisplay />}
      </Group>
    </Card>
  );
}
