import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

const APTOGOTCHI_CONTRACT_ADDRESS =
  "0x497c93ccd5d3c3e24a8226d320ecc9c69697c0dad5e1f195553d7eaa1140e91f";
const COLLECTION_ID =
  "0xfce62045f3ac19160c1e88662682ccb6ef1173eba82638b8bae172cc83d8e8b8";
const COLLECTION_CREATOR_ADDRESS =
  "0x714319fa1946db285254e3c7c75a9aac05277200e59429dd1f80f25272910d9c";
const COLLECTION_NAME = "Aptogotchi Collection";
const MARKETPLACE_CONTRACT_ADDRESS =
  "0xbf60e962f7e34a0c317cbcd9454a7125a1c3c3d15ec620688e0f357100284605";
// const APT = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
const APT = "0x1::aptos_coin::AptosCoin";
const PRIVATE_KEY =
  "0xe567dbcf809d50976d31b7490eedd2b6a79c4e5a8c78a0a00034c98842b2c660";

const config = new AptosConfig({
  network: Network.TESTNET,
});
const aptos = new Aptos(config);
let sender = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(PRIVATE_KEY),
});
console.log("sender address", sender.accountAddress.toString());

const getAptogotchi = async (aptogotchiObjectAddr: string) => {
  const aptogotchi = await aptos.view({
    payload: {
      function: `${APTOGOTCHI_CONTRACT_ADDRESS}::main::get_aptogotchi`,
      typeArguments: [],
      functionArguments: [aptogotchiObjectAddr],
    },
  });
  console.log(aptogotchi);
  return aptogotchi;
};

const mintAptogotchi = async (
  name: string,
  body: number,
  ear: number,
  face: number
) => {
  const rawTxn = await aptos.transaction.build.simple({
    sender: sender.accountAddress,
    data: {
      function: `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_aptogotchi`,
      functionArguments: ["a1", 1, 1, 1],
    },
  });
  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: sender,
    transaction: rawTxn,
  });
  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  console.log("minted aptogotchi. - ", response.hash);
};

const getAptBalance = async (addr: string) => {
  const result = await aptos.getAccountCoinAmount({
    accountAddress: addr,
    coinType: APT,
  });

  console.log("APT balance", result);
  return result;
};

const getCollection = async () => {
  // const collection = await aptos.getCollectionDataByCollectionId({
  //   collectionId: COLLECTION_ID,
  // });
  const collection = await aptos.getCollectionData({
    collectionName: COLLECTION_NAME,
    creatorAddress: COLLECTION_CREATOR_ADDRESS,
  });
  console.log("collection", collection);
  return collection;
};

const getAllMyAptogotchis = async () => {
  const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
    accountAddress: sender.accountAddress,
    collectionAddress: COLLECTION_ID,
  });

  console.log("my aptogotchis", result);
};

const getAllAptogotchis = async () => {
  const result = await aptos.queryIndexer({
    query: {
      query: `
        query MyQuery($collectionId: String) {
          current_token_datas_v2(
            where: {collection_id: {_eq: $collectionId}}
          ) {
            collection_id
            description
            supply
            token_name
            token_data_id
            token_standard
            token_uri
            token_properties
            is_fungible_v2
            last_transaction_version
            last_transaction_timestamp
            maximum
            largest_property_version_v1
          }
        }
      `,
      variables: { collectionId: COLLECTION_ID },
    },
  });
  console.log("all aptogotchis", result);
};

const listAptogotchi = async (aptogotchiObjectAddr: string) => {
  const rawTxn = await aptos.transaction.build.simple({
    sender: sender.accountAddress,
    data: {
      function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::list_with_fixed_price`,
      typeArguments: [APT],
      functionArguments: [aptogotchiObjectAddr, 10],
    },
  });
  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: sender,
    transaction: rawTxn,
  });
  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  console.log("listed aptogotchi. - ", response.hash);
};

const buyAptogotchi = async (listingObjectAddr: string) => {
  const rawTxn = await aptos.transaction.build.simple({
    sender: sender.accountAddress,
    data: {
      function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::purchase`,
      typeArguments: [APT],
      functionArguments: [listingObjectAddr],
    },
  });
  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: sender,
    transaction: rawTxn,
  });
  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  console.log("bought aptogotchi. - ", response.hash);
};

const getAllListings = async (sellerAddr: string) => {
  const allListings = await aptos.view({
    payload: {
      function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::get_seller_listings`,
      typeArguments: [],
      functionArguments: [sellerAddr],
    },
  });
  console.log("all listings", allListings);
  return allListings;
};

const getAllSellers = async () => {
  const allListings = await aptos.view({
    payload: {
      function: `${MARKETPLACE_CONTRACT_ADDRESS}::list_and_purchase::get_sellers`,
      typeArguments: [],
      functionArguments: [],
    },
  });
  console.log("all sellers", allListings);
  return allListings;
};

const run = async () => {
  // await getAptBalance(sender.accountAddress.toString());
  // mintAptogotchi("a1", 1, 1, 1);
  getAllMyAptogotchis();
  // getCollection();
  // getAllAptogotchis();
  // listAptogotchi(
  //   "0x5c46ae9cbab4ea007f006cff5db2eb9c3c31f7395c424f56a2e7f5e64a3d7050"
  // );
  // buyAptogotchi(
  //   "0x488e2131669115c5d39b805b5b24a6acf6c6fa803b53be6d2e1bb5e4c3bee849"
  // );
  // getAllListings(sender.accountAddress.toString());
  // getAllSellers();
};

run();
