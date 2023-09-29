import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import NextAuthProvider from "@/components/NextAuthProvider";
import { Navbar } from "@/components/Navbar/Navbar";

import { theme } from "../theme";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

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
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <ColorSchemeScript />
      </head>
      <body>
        <NextAuthProvider>
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <Notifications />
            <Navbar />
            {children}
          </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
