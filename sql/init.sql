CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE NOT NULL,
  goal TEXT,
  skills TEXT[],
  preferences JSONB,
  avoid_rules TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  material_id VARCHAR(64) UNIQUE NOT NULL,
  url TEXT,
  filename TEXT,
  ipfs_hash TEXT,
  tags JSONB,
  quality_score REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS demands (
  id SERIAL PRIMARY KEY,
  demand_id VARCHAR(64) UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  tech_stack TEXT[],
  budget_stablecoin BIGINT,
  status VARCHAR(32),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  answer_id VARCHAR(64) UNIQUE NOT NULL,
  demand_id VARCHAR(64),
  contributor VARCHAR(128),
  content_uri TEXT,
  quality REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nfts (
  id SERIAL PRIMARY KEY,
  nft_id VARCHAR(64) UNIQUE NOT NULL,
  demand_id VARCHAR(64),
  content_hash TEXT,
  summary TEXT,
  contributors JSONB,
  ownership VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);