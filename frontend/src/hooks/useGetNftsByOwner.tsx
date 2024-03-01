import { getUserOwnedAptogotchis } from "@/utils/aptos";
import { Aptogotchi } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetNftsByOwner = (ownerAddr: string) => {
  const [nfts, setNfts] = useState<Aptogotchi[]>([]);
  useEffect(() => {
    getUserOwnedAptogotchis(ownerAddr).then((res) => {
      setNfts(
        res.map((nft) => {
          return {
            token_name: nft.current_token_data?.token_name || "no name",
            token_data_id: nft.token_data_id || "no id",
            token_uri: nft.current_token_data?.token_uri || "no uri",
          };
        })
      );
    });
  }, [ownerAddr]);
  return nfts;
};
