import { List } from "@/components/List";
import { useGetListingsBySeller } from "@/hooks/useGetListingsBySeller";
import { useGetNftsByOwner } from "@/hooks/useGetNftsByOwner";
import {
  Box,
  Card,
  Divider,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  CardFooter,
} from "@chakra-ui/react";

type Props = {
  address: string;
};

export const Portfolio = ({ address }: Props) => {
  const nftsInWallet = useGetNftsByOwner(address);
  const nftsListed = useGetListingsBySeller(address);
  return (
    <VStack spacing={4}>
      <Heading>In Wallet</Heading>
      <SimpleGrid spacing={10}>
        {nftsInWallet.map((nft) => {
          return (
            <Card key={nft.token_data_id}>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Name
                </Heading>
                <Text pt="2" fontSize="sm">
                  {nft.token_name}
                </Text>
              </Box>
              <CardFooter>
                <List nftTokenObjectAddr={nft.token_data_id} />
              </CardFooter>
            </Card>
          );
        })}
      </SimpleGrid>
      <Divider />
      <Heading>Listed on Marketplace</Heading>
      <SimpleGrid spacing={10}>
        {nftsListed.map((listing) => {
          return (
            <Card key={listing}>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Listing Object Address
                </Heading>
                <Text pt="2" fontSize="sm">
                  {listing}
                </Text>
              </Box>
            </Card>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};
