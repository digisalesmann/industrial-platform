-- Update assets table for gallery
-- Run this migration to add new columns

ALTER TABLE assets ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS image TEXT;

-- Seed some sample gallery data
INSERT INTO assets (name, type, value, rarity, image) VALUES
('Void Unit 01', 'Industrial', '2.5 ETH', 'Legendary', 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop'),
('Neon Soul', 'Cyber', '0.8 ETH', 'Rare', 'https://images.unsplash.com/photo-1635324738556-3fe69767d80b?w=400&h=400&fit=crop'),
('Silicon V2', 'Organic', '0.4 ETH', 'Common', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop'),
('Core Engine', 'Industrial', '1.2 ETH', 'Epic', 'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=400&h=400&fit=crop'),
('Quantum Flux', 'Cyber', '3.2 ETH', 'Legendary', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop'),
('Bio Matrix', 'Organic', '0.6 ETH', 'Rare', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'),
('Steel Forge', 'Industrial', '1.8 ETH', 'Epic', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop'),
('Neon Runner', 'Cyber', '0.9 ETH', 'Rare', 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=crop'),
('Terra Cell', 'Organic', '0.3 ETH', 'Common', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop'),
('Mech Heart', 'Industrial', '4.5 ETH', 'Legendary', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=400&fit=crop'),
('Circuit Mind', 'Cyber', '1.1 ETH', 'Epic', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop'),
('Root System', 'Organic', '0.5 ETH', 'Rare', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop')
ON CONFLICT DO NOTHING;
