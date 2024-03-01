import { getAllListings } from "@/utils/aptos";
import { useEffect, useState } from "react";

export const useGetListingsBySeller = (sellerAddr: string) => {
  const [listings, setListings] = useState<string[]>([]);
  useEffect(() => {
    getAllListings(sellerAddr).then((res) => {
      setListings(res);
    });
  }, [sellerAddr]);
  return listings;
};
