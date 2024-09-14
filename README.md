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
- PostgreSQL database
- Spotify application, [click here](https://developer.spotify.com/dashboard/applications) to create one
- Discord application, [click here](https://discord.com/developers/applications) to create one
- Running instance of the Zeenox bot

---

> ⚠️ **_Note:_** The bot is required to be running for the web interface to work! <br>
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
BOT_URL= # URL to the Zeenox bot (https://localhost)
WEB_URL= # URL of the web interface (http://localhost:3000)
DATABASE_URL= # PostgreSQL database URL (postgres://zeenox:zeenox@localhost:5432/zeenox?search_path=web) search_path is you want to use the same database for the bot and the web interface
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

4. Import schema.sql to your PostgreSQL database

```bash
psql -U zeenox -d zeenox -f schema.sql
```

5. Start the server

```bash
npm run dev
```

## License

- See [LICENSE](https://github.com/KMen1/Zeenox-Web/blob/main/LICENSE)
