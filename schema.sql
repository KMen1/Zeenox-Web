CREATE TABLE auth_user (
    id TEXT PRIMARY KEY,
	username TEXT NOT NULL,
	avatar_url TEXT NOT NULL
);

CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id TEXT NOT NULL REFERENCES auth_user(id)
);

CREATE TABLE oauth_account (
	provider_id TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	access_token TEXT NOT NULL,
	refresh_token TEXT NOT NULL,
	expires_at INT NOT NULL,
	PRIMARY KEY (provider_id, provider_user_id),
    FOREIGN KEY (user_id) REFERENCES auth_user(id)
)