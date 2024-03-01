import { getAllAptogotchis } from "@/utils/aptos";
import { Aptogotchi } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetAllNfts = () => {
  const [nfts, setNfts] = useState<Aptogotchi[]>([]);
  useEffect(() => {
    getAllAptogotchis().then((res) => {
      setNfts(res);
    });
  }, []);
  return nfts;
};
