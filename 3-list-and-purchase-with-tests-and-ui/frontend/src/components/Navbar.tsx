"use client";

import { HStack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { WalletButtons } from "./WalletButtons";
import { Mint } from "./Mint";

export const NavBar = () => {
  return (
    <HStack>
      <Link href="/">Home</Link>
      <Link href="/portfolio">Portfolio</Link>
      <Mint />
      <WalletButtons />
    </HStack>
  );
};
