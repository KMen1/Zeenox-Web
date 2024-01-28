export enum Provider {
  Discord = "oauth_discord",
  Spotify = "oauth_spotify",
}

export interface AccessTokenResponse {
  object: string;
  token: string;
  provider: string;
  public_metadata: PublicMetadata;
  label: null;
  scopes: string[];
}

export interface PublicMetadata {}
