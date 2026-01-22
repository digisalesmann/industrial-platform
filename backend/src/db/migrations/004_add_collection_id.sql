-- Add collection_id to assets for collection filtering
ALTER TABLE assets ADD COLUMN IF NOT EXISTS collection_id VARCHAR(100);
