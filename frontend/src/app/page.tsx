"use client";

import { getAptosClient, Collection } from "@/utils/aptosClient";
import { COLLECTION_CREATOR_ADDRESS, COLLECTION_NAME } from "@/utils/constants";
import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const aptos = getAptosClient();

const getCollection = async () => {
  return aptos.getCollectionData({
    collectionName: COLLECTION_NAME,
    creatorAddress: COLLECTION_CREATOR_ADDRESS,
  });
};



export default function Home() {
  const [collection, setCollection] = useState<Collection>();
  useEffect(() => {
    getCollection()
      .then((data) => setCollection(data))
      .catch(console.error);
  }, []);

  return (
    <main>
      <Card>
        <CardBody>
          <Text>{JSON.stringify(collection)}</Text>
        </CardBody>
      </Card>
    </main>
  );
}
