import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, goerli, polygon, optimism, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Industrial Platform',
  projectId: 'ada2ad81cdf9bb49cda2679aed2756af',
  chains: [mainnet, sepolia, goerli, polygon, optimism, arbitrum], // Standard public networks
  ssr: true,
});