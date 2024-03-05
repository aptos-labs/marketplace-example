import { List } from "@/components/List";
import { useGetListedNftsBySeller } from "@/hooks/useGetListedNftsBySeller";
import { useGetNftsByOwner } from "@/hooks/useGetNftsByOwner";
import { Divider, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import { NftCard } from "./NftCard";

type Props = {
  address: string;
};

export const Portfolio = ({ address }: Props) => {
  const nftsInWallet = useGetNftsByOwner(address);
  const nftsListed = useGetListedNftsBySeller(address);
  return (
    <VStack spacing={4}>
      <Heading>In Wallet</Heading>
      {nftsInWallet && (
        <SimpleGrid spacing={10} columns={3}>
          {nftsInWallet.map((nft) => {
            return (
              <NftCard nft={nft} key={nft.address}>
                <List nftTokenObjectAddr={nft.address} />
              </NftCard>
            );
          })}
        </SimpleGrid>
      )}
      <Divider />
      <Heading>Listed on Marketplace</Heading>
      {nftsListed &&
        (nftsListed.length > 0 ? (
          <SimpleGrid spacing={10} columns={3}>
            {nftsListed.map((nft) => {
              return <NftCard key={nft.address} nft={nft} />;
            })}
          </SimpleGrid>
        ) : (
          <Heading as="h4" size="md">
            No NFT listed
          </Heading>
        ))}
    </VStack>
  );
};
