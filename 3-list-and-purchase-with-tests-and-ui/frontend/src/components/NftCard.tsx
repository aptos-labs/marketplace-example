import Image from "next/image";
import {
  Box,
  Card,
  CardBody,
  Text,
  HStack,
  CardFooter,
} from "@chakra-ui/react";
import { BASE_PATH, bodies, ears, faces } from "@/utils/constants";
import Link from "next/link";
import {
  AptogotchiWithTraits,
  ListedAptogotchiWithTraits,
} from "@/utils/types";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  nft: AptogotchiWithTraits | ListedAptogotchiWithTraits;
};

export const NftCard = ({ nft, children }: Props) => {
  const headUrl = BASE_PATH + "head.png";
  const bodyUrl = BASE_PATH + bodies[nft.body];
  const earUrl = BASE_PATH + ears[nft.ear];
  const faceUrl = BASE_PATH + faces[nft.face];

  return (
    <Card>
      <CardBody>
        <Box position={"relative"} height="100px" width="100px">
          <Box position={"absolute"} top={"0px"} left={"0px"}>
            <Image src={headUrl} alt="pet head" height="100" width="100" />
          </Box>
          <Box position={"absolute"} top={"0px"} left={"0px"}>
            <Image src={bodyUrl} alt="pet body" height="100" width="100" />
          </Box>
          <Box position={"absolute"} top={"0px"} left={"0px"}>
            <Image src={earUrl} alt="pet ears" height="100" width="100" />
          </Box>
          <Box position={"absolute"} top={"0px"} left={"0px"}>
            <Image src={faceUrl} alt="pet face" height="100" width="100" />
          </Box>
        </Box>
        <HStack spacing={5}>
          <Text>Name {nft.name}</Text>
          <Link
            href={`https://explorer.aptoslabs.com/object/${nft.address}?network=testnet`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View NFT on explorer
          </Link>
        </HStack>
      </CardBody>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
};
