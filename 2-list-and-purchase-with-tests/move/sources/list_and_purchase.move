module marketplace::list_and_purchase {
    use std::error;
    use std::signer;
    use std::option::{Self, Option};

    use aptos_framework::aptos_account;
    use aptos_framework::coin;
    use aptos_framework::object::{Self, DeleteRef, ExtendRef, Object, ObjectCore};

    #[test_only]
    friend marketplace::test_list_and_purchase;

    /// There exists no listing.
    const ENO_LISTING: u64 = 1;

    // Core data structures

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Listing has key {
        /// The item owned by this listing, transferred to the new owner at the end.
        object: Object<ObjectCore>,
        /// The seller of the object.
        seller: address,
        /// Used to clean-up at the end.
        delete_ref: DeleteRef,
        /// Used to create a signer to transfer the listed item, ideally the TransferRef would support this.
        extend_ref: ExtendRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct FixedPriceListing<phantom CoinType> has key {
        /// The price to purchase the item up for listing.
        price: u64,
    }

    // Functions

    /// List an time for sale at a fixed price.
    public entry fun list_with_fixed_price<CoinType>(
        seller: &signer,
        object: Object<ObjectCore>,
        price: u64,
    ) {
        list_with_fixed_price_internal<CoinType>(seller, object, price);
    }

    public(friend) fun list_with_fixed_price_internal<CoinType>(
        seller: &signer,
        object: Object<ObjectCore>,
        price: u64,        
    ): Object<Listing> {
        let constructor_ref = object::create_object(signer::address_of(seller));

        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        object::disable_ungated_transfer(&transfer_ref);

        let listing_signer = object::generate_signer(&constructor_ref);

        let listing = Listing {
            object,
            seller: signer::address_of(seller),
            delete_ref: object::generate_delete_ref(&constructor_ref),
            extend_ref: object::generate_extend_ref(&constructor_ref),
        };
        let fixed_price_listing = FixedPriceListing<CoinType> {
            price,
        };
        move_to(&listing_signer, listing);
        move_to(&listing_signer, fixed_price_listing);

        object::transfer(seller, object, signer::address_of(&listing_signer));

        let listing = object::object_from_constructor_ref(&constructor_ref);

        listing
    }

    /// Purchase outright an item from a fixed price listing.
    public entry fun purchase<CoinType>(
        purchaser: &signer,
        object: Object<ObjectCore>,
    ) acquires FixedPriceListing, Listing {
        let listing_addr = object::object_address(&object);
        
        assert!(exists<Listing>(listing_addr), error::not_found(ENO_LISTING));
        assert!(exists<FixedPriceListing<CoinType>>(listing_addr), error::not_found(ENO_LISTING));

        let FixedPriceListing {
            price,
        } = move_from<FixedPriceListing<CoinType>>(listing_addr);

        // The listing has concluded, transfer the asset and delete the listing. Returns the seller
        // for depositing any profit.

        let coins = coin::withdraw<CoinType>(purchaser, price);

        let Listing {
            object,
            seller, // get seller from Listing object
            delete_ref,
            extend_ref,
        } = move_from<Listing>(listing_addr);

        let obj_signer = object::generate_signer_for_extending(&extend_ref);
        object::transfer(&obj_signer, object, signer::address_of(purchaser));
        object::delete(delete_ref); // Clean-up the listing object.

        aptos_account::deposit_coins(seller, coins);
    }

    // Helper functions

    inline fun borrow_listing(object: Object<Listing>): &Listing acquires Listing {
        let obj_addr = object::object_address(&object);
        assert!(exists<Listing>(obj_addr), error::not_found(ENO_LISTING));
        borrow_global<Listing>(obj_addr)
    }

    // View functions

    #[view]
    public fun price<CoinType>(
        object: Object<Listing>,
    ): Option<u64> acquires FixedPriceListing {
        let listing_addr = object::object_address(&object);
        if (exists<FixedPriceListing<CoinType>>(listing_addr)) {
            let fixed_price = borrow_global<FixedPriceListing<CoinType>>(listing_addr);
            option::some(fixed_price.price)
        } else {
            // This should just be an abort but the compiler errors.
            assert!(false, error::not_found(ENO_LISTING));
            option::none()
        }
    }

    #[view]
    public fun listed_object(object: Object<Listing>): Object<ObjectCore> acquires Listing {
        let listing = borrow_listing(object);
        listing.object
    }
}


// Unit tests

#[test_only]
module marketplace::test_list_and_purchase {

    use std::option;

    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::object::{Self, Object, ObjectCore};

    use aptos_token_objects::token::Token;

    use marketplace::list_and_purchase::{Self, Listing};
    use marketplace::test_utils;

    // Test that a fixed price listing can be created and purchased.
    #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
    fun test_fixed_price(
        aptos_framework: &signer,
        marketplace: &signer,
        seller: &signer,
        purchaser: &signer,
    ) {
        let (_marketplace_addr, seller_addr, purchaser_addr) =
            test_utils::setup(aptos_framework, marketplace, seller, purchaser);

        let (token, listing) = fixed_price_listing(seller, 500); // price: 500

        assert!(list_and_purchase::listed_object(listing) == object::convert(token), 0); // The token is listed.
        assert!(list_and_purchase::price<AptosCoin>(listing) == option::some(500), 0); // The price is 500.
        assert!(object::owner(token) == object::object_address(&listing), 0); // The token is owned by the listing object. (escrowed)

        list_and_purchase::purchase<AptosCoin>(purchaser, object::convert(listing));

        assert!(object::owner(token) == purchaser_addr, 0); // The token has been transferred to the purchaser.
        assert!(coin::balance<AptosCoin>(seller_addr) == 10500, 0); // The seller has been paid.
        assert!(coin::balance<AptosCoin>(purchaser_addr) == 9500, 0); // The purchaser has paid.
    }

    // Test that the purchase fails if the purchaser does not have enough coin.
    #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
    #[expected_failure(abort_code = 0x10006, location = aptos_framework::coin)]
    fun test_not_enough_coin_fixed_price(
        aptos_framework: &signer,
        marketplace: &signer,
        seller: &signer,
        purchaser: &signer,
    ) {
        test_utils::setup(aptos_framework, marketplace, seller, purchaser);

        let (_token, listing) = fixed_price_listing(seller, 100000); // price: 100000

        list_and_purchase::purchase<AptosCoin>(purchaser, object::convert(listing));
    }

    // Test that the purchase fails if the listing object does not exist.
    #[test(aptos_framework = @0x1, marketplace = @0x111, seller = @0x222, purchaser = @0x333)]
    #[expected_failure(abort_code = 0x60001, location = marketplace::list_and_purchase)]
    fun test_no_listing(
        aptos_framework: &signer,
        marketplace: &signer,
        seller: &signer,
        purchaser: &signer,
    ) {
        let (_, seller_addr, _) = test_utils::setup(aptos_framework, marketplace, seller, purchaser);

        let dummy_constructor_ref = object::create_object(seller_addr);
        let dummy_object = object::object_from_constructor_ref<ObjectCore>(&dummy_constructor_ref);

        list_and_purchase::purchase<AptosCoin>(purchaser, object::convert(dummy_object));
    }


    inline fun fixed_price_listing(
        seller: &signer,
        price: u64
    ): (Object<Token>, Object<Listing>) {
        let token = test_utils::mint_tokenv2(seller);
        fixed_price_listing_with_token(seller, token, price)
    }

    inline fun fixed_price_listing_with_token(
        seller: &signer,
        token: Object<Token>,
        price: u64
    ): (Object<Token>, Object<Listing>) {
        let listing = list_and_purchase::list_with_fixed_price_internal<AptosCoin>(
            seller,
            object::convert(token), // Object<Token> -> Object<ObjectCore>
            price,
        );
        (token, listing)
    }
}