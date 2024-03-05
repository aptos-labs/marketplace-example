"use client";

import { AllNfts } from "@/components/AllNfts";
import { ListedNfts } from "@/components/ListedNfts";
import { HStack, Heading, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
  const [radioValue, setRadioValue] = useState<"All" | "Listed Only">("All");

  return (
    <VStack>
      <Heading margin={4}>Aptogotchi NFTs</Heading>

      <RadioGroup defaultValue="All">
        <HStack justifyContent="center">
          <Radio
            value="All"
            onChange={() => {
              setRadioValue("All");
            }}
          >
            View all
          </Radio>
          <Radio
            value="Listed Only"
            onChange={() => {
              setRadioValue("Listed Only");
            }}
          >
            Listed only
          </Radio>
        </HStack>
      </RadioGroup>
      {radioValue === "Listed Only" ? <ListedNfts /> : <AllNfts />}
    </VStack>
  );
}
