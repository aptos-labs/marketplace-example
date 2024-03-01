"use client";

import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Box, Heading } from "@chakra-ui/react";
import { Portfolio } from "./Portfolio";

export default function Page() {
  const { connected, network, account } = useWallet();
  if (!connected) {
    return (
      <Box>
        <Heading>Connect Wallet to See Your Portfolio</Heading>
      </Box>
    );
  }
  if (network?.chainId != NetworkToChainId[Network.TESTNET].toString()) {
    return (
      <Box>
        <Heading>Please Connect to Testnet</Heading>
      </Box>
    );
  }
  return account && <Portfolio address={account.address} />;
}
