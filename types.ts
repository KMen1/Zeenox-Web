export enum QueueActionType {
  AddTrack,
  AddPlaylist,
  Clear,
  Distinct,
  Reverse,
  Shuffle,
  MoveTrack,
  RemoveTrack,
}

export type SeekAction = {
  Position: number;
} & Action;

export type ChangeLoopModeAction = {
  LoopMode: RepeatMode;
} & Action;

export type VolumeAction = {
  Volume: number;
} & Action;

export type SkipAction = {
  PreviousTrack: TrackData;
  Track: TrackData;
} & Action;

export type PlayAction = {
  Track: TrackData;
} & Action;

export type QueueAction = {
  QueueActionType: QueueActionType;
} & Action;

export type EnqueuePlaylistAction = {
  Tracks: TrackData[];
} & QueueAction;

export type EnqueueTrackAction = {
  Track: TrackData;
} & QueueAction;

export type RemoveTrackAction = {
  Track: TrackData;
} & QueueAction;

export type MoveTrackAction = {
  Track: TrackData;
  From: number;
  To: number;
} & QueueAction;

export type ServerMessage = {
  Data: PlayerData | QueueData | TrackData;
};

export enum PlayerState {
  Destroyed,
  NotPlaying,
  Playing,
  Paused,
}

export enum RepeatMode {
  None,
  Track,
  Queue,
}

export type ServerMessageData = {
  Type: string;
};

export type InitData = {
  VoiceChannelName: string;
  StartedAt: number;
  Position: number;
} & ServerMessageData;

export type PlayerData = {
  State: PlayerState;
  RepeatMode: RepeatMode;
  Volume: number;
  Position: number | null;
  Listeners: DiscordUserData[];
} & ServerMessageData;

export type ActionData = {
  Action: Action;
} & ServerMessageData;

export type ActionsData = {
  Actions: Action[];
} & ServerMessageData;

export type Action = {
  Type: ActionType;
  User: DiscordUserData;
  Message: string;
  Timestamp: number;
};

export enum ActionType {
  Play,
  Queue,
  Rewind,
  Pause,
  Resume,
  Skip,
  Stop,
  Seek,
  VolumeUp,
  VolumeDown,
  ChangeLoopMode,
}

export type ActionResult = {
  success: boolean;
  error?: string;
};

export type QueueData = {
  Tracks: TrackData[];
} & ServerMessageData;

export type TrackData = {
  Identifier: string;
  Title: string;
  Author: string;
  Url: string | null;
  Thumbnail: string | null;
  Duration: number;
  RequestedBy: DiscordUserData;
} & ServerMessageData;

export type DiscordUserData = {
  Username: string;
  DisplayName: string;
  AvatarUrl: string | null;
};

export type GuildData = {
  Id: string;
  Name: string;
  IconUrl: string;
};

export enum Provider {
  Discord = "oauth_discord",
  Spotify = "oauth_spotify",
}

/// clerk
export interface AccessTokenResponse {
  object: string;
  token: string;
  provider: string;
  public_metadata: PublicMetadata;
  label: null;
  scopes: string[];
}

export interface PublicMetadata {}

/// discord
export interface PartialGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  permissions_new: string;
}

/// spotify
export interface PlaylistsResponse {
  href: string;
  items: Playlist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracks;
  type: ItemType;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number | null;
  url: string;
  width: number | null;
}

export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: OwnerType;
  uri: string;
}

export enum OwnerType {
  User = "user",
}

export interface PlaylistTracks {
  href: string;
  total: number;
}

export enum ItemType {
  Playlist = "playlist",
}

/// spotify
export interface SavedTracksResponse {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: TrackItem[];
}

export interface TrackItem {
  added_at: string;
  track: Track;
}

export interface Track {
  album: Album;
  artists: TrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restrictions;
  type: string;
  uri: string;
  artists: AlbumArtist[];
}

export interface AlbumArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Restrictions {
  reason: string;
}

export interface TrackArtist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface ExternalIDS {
  isrc: string;
  ean: string;
  upc: string;
}

export interface LinkedFrom {}

/// search
export interface SearchResponse {
  tracks: Tracks;
}

export interface Tracks {
  href: string;
  items: Track[];
  limit: number;
  next: string;
  offset: number;
  previous: null;
  total: number;
}

export enum AlbumTypeEnum {
  Album = "album",
  Single = "single",
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: ArtistType;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export enum ArtistType {
  Artist = "artist",
}

export enum ReleaseDatePrecision {
  Day = "day",
  Year = "year",
}

export interface ExternalIDS {
  isrc: string;
}

export enum ItemType {
  Track = "track",
}
