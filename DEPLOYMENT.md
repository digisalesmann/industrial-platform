# Industrial Platform - Deployment Guide

## Prerequisites

- Node.js 20+ 
- PostgreSQL 15+
- Docker (optional)

## Environment Setup

### Frontend (.env.local / .env.production)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_EXPLORER_URL=https://etherscan.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_NFT_ADDRESS=0x...your_deployed_nft_address
NEXT_PUBLIC_ROUTER_ADDRESS=0x...your_deployed_router_address
NEXT_PUBLIC_CHAIN_ID=1
```

### Backend (.env)

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/industrial_platform
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
CORS_ORIGIN=https://your-frontend-url.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)

1. Push to GitHub
2. Connect to Vercel
3. Set root directory to `frontend`
4. Add environment variables in Vercel dashboard
5. Deploy

#### Backend (Railway/Render)

1. Create PostgreSQL database
2. Deploy backend from `backend` directory
3. Set environment variables
4. Configure health check on `/health`

### Option 2: Docker Compose (Self-hosted)

```bash
docker-compose up -d
```

### Option 3: Manual Deployment

#### Frontend
```bash
cd frontend
npm install
npm run build
npm start
```

#### Backend
```bash
cd backend
npm install
npm run build
npm start
```

## Database Setup

```sql
CREATE DATABASE industrial_platform;

-- Connect to database and run:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    nonce VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    value DECIMAL(20, 8),
    rarity VARCHAR(50),
    image TEXT,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_owner ON assets(owner_id);
CREATE INDEX idx_assets_rarity ON assets(rarity);
```

## Smart Contract Deployment

1. Update contract addresses in frontend `.env.local`
2. Deploy contracts using Foundry:

```bash
# Local testing
anvil

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast

# Verify on Etherscan
forge verify-contract $CONTRACT_ADDRESS src/IndustrialNFT.sol:IndustrialNFT --etherscan-api-key $ETHERSCAN_KEY
```

## Security Checklist

- [ ] Change default JWT_SECRET (min 32 characters)
- [ ] Use HTTPS in production
- [ ] Configure CORS_ORIGIN to your frontend domain only
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for all secrets
- [ ] Never commit .env files
- [ ] Review and update dependencies regularly

## Health Check Endpoints

- Frontend: `GET /` (returns 200)
- Backend: `GET /health` (returns `{ status: 'ok' }`)

## Monitoring

Consider adding:
- Application monitoring (Sentry, LogRocket)
- Uptime monitoring (UptimeRobot, Pingdom)
- Database monitoring (pgAdmin, Datadog)
