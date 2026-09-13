CREATE TABLE IF NOT EXISTS neighborhoods (id text PRIMARY KEY, name text NOT NULL, aliases jsonb NOT NULL, geometry jsonb NOT NULL, boundary_version text NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id text PRIMARY KEY, nickname text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS contributions (
 id text PRIMARY KEY, neighborhood_id text NOT NULL REFERENCES neighborhoods(id), nickname text NOT NULL,
 body text NOT NULL CHECK (length(body) BETWEEN 1 AND 2000), language text NOT NULL, input_mode text NOT NULL CHECK(input_mode IN ('text','voice')),
 created_at timestamptz NOT NULL DEFAULT now(), diary_date text NOT NULL,
 session_id text REFERENCES sessions(id), idempotency_key text UNIQUE NOT NULL,
 visibility text NOT NULL DEFAULT 'visible', demo_dataset text
);
CREATE INDEX IF NOT EXISTS contribution_day ON contributions(neighborhood_id,diary_date,created_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS chronicles (
 id text PRIMARY KEY, neighborhood_id text NOT NULL REFERENCES neighborhoods(id), diary_date text NOT NULL,
 body text NOT NULL DEFAULT '', title text NOT NULL DEFAULT '', language text NOT NULL DEFAULT 'en',
 source_ids jsonb NOT NULL DEFAULT '[]', contribution_count integer NOT NULL DEFAULT 0,
 status text NOT NULL DEFAULT 'pending', coverage jsonb NOT NULL DEFAULT '{}',
 model text, prompt_version text, generated_at timestamptz, published_at timestamptz,
 claimed_at timestamptz, claim_token text, last_error text, demo_dataset text,
 UNIQUE(neighborhood_id,diary_date)
);
CREATE TABLE IF NOT EXISTS reports (id text PRIMARY KEY, contribution_id text NOT NULL REFERENCES contributions(id), session_id text NOT NULL REFERENCES sessions(id), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(contribution_id,session_id));
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key text PRIMARY KEY, value text NOT NULL);

-- Access goes through the server database owner. No browser-role policies.
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
