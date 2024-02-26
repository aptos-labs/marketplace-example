module marketplace::list_and_purchase {
    use std::error;
    use std::signer;

    use aptos_framework::aptos_account;
    use aptos_framework::coin;
    use aptos_framework::object::{Self, DeleteRef, ExtendRef, Object, ObjectCore};

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
    }

    /// Purchase outright an item from a fixed price listing.
    public entry fun purchase<CoinType>(
        purchaser: &signer,
        object: Object<ObjectCore>,
    ) acquires FixedPriceListing, Listing {
        let listing_addr = object::object_address(&object);
        
        assert!(exists<Listing>(listing_addr), error::not_found(ENO_LISTING));

        let price = if (exists<FixedPriceListing<CoinType>>(listing_addr)) {
            let FixedPriceListing {
                price,
            } = move_from<FixedPriceListing<CoinType>>(listing_addr);
            price
        } else {
            abort (error::not_found(ENO_LISTING))
        };

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
}
