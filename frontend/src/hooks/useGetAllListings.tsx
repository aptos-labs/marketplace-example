import { getAllListings } from "@/utils/aptos";
import { useEffect, useState } from "react";
import { useGetAllSellers } from "./useGetAllSellers";

export const useGetAllListings = () => {
  const sellers = useGetAllSellers();
  const [listings, setListings] = useState<string[]>([]);
  useEffect(() => {
    const listings: string[] = [];
    (async () => {
      for (const seller of sellers) {
        const res = await getAllListings(seller);
        listings.push(...res);
      }
      setListings(listings);
    })();
  }, [sellers]);
  return listings;
};
