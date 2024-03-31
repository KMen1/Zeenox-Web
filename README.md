# Zeenox Web

[![Discord](https://discordapp.com/api/guilds/863751874922676234/widget.png)](https://discord.gg/hGxaMkfMBR)
[![License](https://img.shields.io/github/license/kmen1/zeenox-web)](https://github.com/KMen1/Zeenox/blob/main/LICENSE)
[![CodeFactor](https://www.codefactor.io/repository/github/kmen1/zeenox-web/badge)](https://www.codefactor.io/repository/github/kmen1/zeenox-web)

Web interface for the Zeenox Discord music bot, for more information about the bot [click here](https://github.com/KMen1/Zeenox)

## Features

- Player controls
- Queue management
- Spotify integration
- Real-time updates and data display
- Synced lyrics
- Server settings (WIP)

<img src="https://img001.prntscr.com/file/img001/WIcCX6cXS2aSbbrPxyXv2Q.png">

## Setup

### Requirements

- Node.js with npm
- Clerk application, [click here](https://clerk.com/) to create one
- Spotify application, [click here](https://developer.spotify.com/dashboard/applications) to create one
- Discord OAuth application, [click here](https://discord.com/developers/applications) to create one
- Running instance of the Zeenox bot

---

> ⚠️ **_Note:_** The bot is required to be running for the web interface to work! <br>
> ⚙️ **_Clerk Settings:_** Only allow login with discord, but allow to link spotify<br>
> 🔎 **_Required Scopes (discord):_** identify, email, guilds<br>
> 🔎 **_Required Scopes (spotify):_** user-read-email, playlist-read-private, user-library-modify, user-library-read<br>
> ⚠️ **_Note:_** You will need to add every user to your spotify application in order for them to be able to use spotify related features!

---

### Installation

1. Clone the repository

```bash
git clone https://github.com/KMen1/Zeenox-Web.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables

```env
BOT_URL= # URL to the Zeenox bot (https://example.com)
NEXT_PUBLIC_WS_URL= # URL to the Zeenox bot websocket (wss://example.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # Clerk publishable key
CLERK_SECRET_KEY= # Clerk secret key
```

4. Start the server

```bash
npm run dev
```

## License

- See [LICENSE](https://github.com/KMen1/Zeenox-Web/blob/main/LICENSE)
