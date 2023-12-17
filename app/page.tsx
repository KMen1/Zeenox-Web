import { Card } from "@mantine/core";

export default async function Home() {
  //const user = await currentUser();
  //const playlists = await getSpotifyPlaylists(user!.id);
  //const guilds = await getDiscordGuilds(user!.id);
  //const savedTracks = await getSpotifySavedTracks(user!.id);

  return <Card>Home page</Card>; /*(
    <Container>
      <Card>
        <Title>Playlists</Title>
        {playlists?.map((playlist) => (
          <Group key={playlist.id}>
            <Image
              src={playlist.images[0].url}
              width={50}
              height={50}
              alt={playlist.name}
            />
            <Text>{playlist.name}</Text>
          </Group>
        ))}
        <Title>Guilds</Title>
        {guilds?.map((guild) => (
          <Group key={guild.id}>
            <Image
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              width={50}
              height={50}
              alt={guild.name}
            />
            <Text>{guild.name}</Text>
          </Group>
        ))}
        <Title>Saved Tracks</Title>
        {savedTracks?.map((track) => (
          <Group key={track.id}>
            <Image
              src={track.album.images[0].url}
              width={50}
              height={50}
              alt={track.name}
            />
            <Text>{track.name}</Text>
          </Group>
        ))}
      </Card>
    </Container>
  );*/
}
