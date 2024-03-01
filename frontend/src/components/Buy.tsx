import { APT, MARKETPLACE_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@chakra-ui/react";

type Props = {
  listingObjectAddr: string;
};

export const Buy = ({ listingObjectAddr }: Props) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const onSubmit = async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::purchase`,
        typeArguments: [APT],
        functionArguments: [listingObjectAddr],
      },
    });
    await aptos
      .waitForTransaction({
        transactionHash: response.hash,
      })
      .then(() => {
        console.log("Bought");
      });
  };
  return <Button onClick={onSubmit}>Buy</Button>;
};
