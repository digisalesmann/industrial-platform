import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { foundry } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Industrial Platform',
  projectId: 'ada2ad81cdf9bb49cda2679aed2756af', // Optional: Get one at cloud.walletconnect.com
  chains: [foundry], // This points specifically to your local Anvil node
  ssr: true,
});