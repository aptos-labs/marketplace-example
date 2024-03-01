import { APTOGOTCHI_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";
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

export const Mint = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState<string>();
  const onSubmit = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_aptogotchi`,
        typeArguments: [],
        functionArguments: [name, "1", "1", "1"],
      },
    });
    await aptos
      .waitForTransaction({
        transactionHash: response.hash,
      })
      .then(() => {
        console.log("Minted");
        onClose();
      });
  };
  return (
    <>
      <Button onClick={onOpen}>Mint</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint a new Aptogotchi NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Aptogotchi Name</FormLabel>
              <Input
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onSubmit}>
              Mint
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
