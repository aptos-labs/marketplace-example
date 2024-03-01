"use client";

import { Buy } from "@/components/Buy";
import { useGetAllListings } from "@/hooks/useGetAllListings";
import {
  Box,
  Card,
  Text,
  Heading,
  SimpleGrid,
  CardFooter,
} from "@chakra-ui/react";

export default function Page() {
  const allListings = useGetAllListings();
  return (
    <SimpleGrid spacing={10}>
      {allListings.map((listing) => {
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
            <CardFooter>
              <Buy listingObjectAddr={listing} />
            </CardFooter>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
