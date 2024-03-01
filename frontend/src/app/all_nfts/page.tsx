"use client";

import { useGetAllNfts } from "@/hooks/useGetAllNfts";
import { Box, Card, Text, Heading, SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  const allNfts = useGetAllNfts();
  return (
    <SimpleGrid spacing={10}>
      {allNfts.map((nft) => {
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
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
