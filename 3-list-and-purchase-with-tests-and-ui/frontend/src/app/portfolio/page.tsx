"use client";

import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import { Portfolio } from "../../components/Portfolio";

export default function Page() {
  return (
    <Box>
      <Heading margin={4} textAlign="center">
        My Portfolio
      </Heading>
      <PageContent />
    </Box>
  );
}

function PageContent() {
  const { connected, network, account } = useWallet();

  if (!connected) {
    return (
      <Alert status="warning" variant="left-accent" marginY={8}>
        <AlertIcon />
        Connect wallet to see your portfolio.
      </Alert>
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
