// This script fetches live NFT collections and assets from Reservoir API and adds them to your backend database.
// Reservoir is recommended for production: it aggregates multiple marketplaces, is fast, and supports many chains.
// Docs: https://docs.reservoir.tools/reference/collections-v6

import fetch from 'node-fetch';
import { Pool } from 'pg';

const RESERVOIR_API = 'https://api.reservoir.tools';
const CHAIN = 'ethereum'; // You can use 'polygon', 'base', etc.
const COLLECTIONS_LIMIT = 10; // Number of collections to fetch per run
const ASSETS_LIMIT = 20; // Number of NFTs per collection

// Configure your DB connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/industrial',
});

async function fetchCollections() {
    const url = `${RESERVOIR_API}/collections/v6?chain=${CHAIN}&limit=${COLLECTIONS_LIMIT}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.collections || [];
}

async function fetchAssets(contract) {
    const url = `${RESERVOIR_API}/tokens/v6?chain=${CHAIN}&collection=${contract}&limit=${ASSETS_LIMIT}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.tokens || [];
}

async function upsertCollection(collection) {
    // Map and upsert collection into your DB (adjust fields as needed)
    const { id, name, image, description } = collection;
    await pool.query(
        `INSERT INTO collections (id, name, image, description)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET name = $2, image = $3, description = $4`,
        [id, name, image, description]
    );
}

async function upsertAsset(token, collectionId) {
    // Map and upsert asset into your DB (adjust fields as needed)
    const { tokenId, name, image, description, owner, lastSale } = token;
    await pool.query(
        `INSERT INTO assets (id, name, image, description, collection_id, owner, price)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET name = $2, image = $3, description = $4, collection_id = $5, owner = $6, price = $7`,
        [tokenId, name, image, description, collectionId, owner, lastSale?.price || null]
    );
}

async function main() {
    const collections = await fetchCollections();
    for (const col of collections) {
        await upsertCollection(col);
        const assets = await fetchAssets(col.id);
        for (const asset of assets) {
            await upsertAsset(asset.token, col.id);
        }
    }
    console.log('NFT collections and assets imported!');
    await pool.end();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
