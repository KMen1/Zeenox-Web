import {
  ColorSchemeScript,
  Container,
  MantineProvider,
  Stack,
} from "@mantine/core";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";

import { theme } from "../theme";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { Navbar } from "@/components/Navbar/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Zeenox",
  description: "Welcome to Zeenox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <ColorSchemeScript />
        </head>
        <body>
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Container p="md" size="xl">
              <Stack gap="md">
                <Navbar />
                {children}
              </Stack>
            </Container>
            <Notifications position="top-center" />
          </MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
