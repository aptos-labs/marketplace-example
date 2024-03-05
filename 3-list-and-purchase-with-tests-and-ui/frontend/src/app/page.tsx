"use client";

import { AllNfts } from "@/components/AllNfts";
import { ListedNfts } from "@/components/ListedNfts";
import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
  const [listedOnly, setListedOnly] = useState(false);
  return (
    <VStack>
      <FormControl as="fieldset">
        <FormLabel as="legend">NFTs of Aptogotchi Collection</FormLabel>
        <RadioGroup defaultValue="View all">
          <HStack>
            <Radio
              value="View all"
              onChange={() => {
                setListedOnly(false);
              }}
            >
              View all
            </Radio>
            <Radio
              value="Listed only"
              onChange={() => {
                setListedOnly(true);
              }}
            >
              Listed only
            </Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      {listedOnly ? <ListedNfts /> : <AllNfts />}
    </VStack>
  );
}
