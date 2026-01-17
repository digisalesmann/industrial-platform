-- Update users table for wallet-based authentication
-- Run this migration to update the schema

ALTER TABLE users DROP COLUMN IF EXISTS email;
ALTER TABLE users DROP COLUMN IF EXISTS password;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nonce VARCHAR(100);
