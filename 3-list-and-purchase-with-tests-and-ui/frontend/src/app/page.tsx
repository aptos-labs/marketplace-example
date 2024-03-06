"use client";

import { AllNfts } from "@/components/AllNfts";
import { ListedNfts } from "@/components/ListedNfts";
import {
  Box,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Page() {
  const [radioValue, setRadioValue] = useState<"All" | "Listed Only">("All");

  return (
    <Box>
      <Heading margin={4} textAlign="center">
        Aptogotchi NFTs
      </Heading>
      <RadioGroup defaultValue="All" margin={4}>
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
    </Box>
  );
}
