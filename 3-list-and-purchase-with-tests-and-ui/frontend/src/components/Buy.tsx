import { APT, MARKETPLACE_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";
import { Listing } from "@/utils/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button, VStack, Text, HStack, Box } from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  listing: Listing;
};

export const Buy = ({ listing }: Props) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const onSubmit = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::purchase`,
        typeArguments: [APT],
        functionArguments: [listing.listing_object_address],
      },
    });
    await aptos
      .waitForTransaction({
        transactionHash: response.hash,
      })
      .then(() => {
        console.log("Bought");
      });
  };
  console.log("listing", listing);
  return (
    <Box>
      <Link
        href={`https://explorer.aptoslabs.com/account/${listing.seller_address}?network=testnet`}
        rel="noopener noreferrer"
        target="_blank"
      >
        View seller on explorer
      </Link>
      <Text>Price: {listing.price} APT</Text>
      <Button onClick={onSubmit}>Buy</Button>
    </Box>
  );
};
