-- Add collections table for NFT imports
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    image TEXT,
    description TEXT
);

-- Add missing columns to assets for NFT imports
ALTER TABLE assets ADD COLUMN IF NOT EXISTS collection_id VARCHAR(255);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS owner VARCHAR(255);

-- Index for collection_id
CREATE INDEX IF NOT EXISTS idx_assets_collection ON assets(collection_id);
