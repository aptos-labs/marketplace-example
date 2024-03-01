import { APT, MARKETPLACE_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  nftTokenObjectAddr: string;
};

export const List = ({ nftTokenObjectAddr }: Props) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState<string>();
  const onSubmit = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    if (!price) {
      throw new Error("Price not set");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::list_with_fixed_price`,
        typeArguments: [APT],
        functionArguments: [nftTokenObjectAddr, parseInt(price) * 100_000_000],
      },
    });
    await aptos
      .waitForTransaction({
        transactionHash: response.hash,
      })
      .then(() => {
        console.log("Listed");
        onClose();
      });
  };
  return (
    <>
      <Button onClick={onOpen}>List</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>List on Marketplace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Price in APT</FormLabel>
              <Input
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onSubmit}>
              List
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
