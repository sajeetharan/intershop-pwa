import { Component } from '@angular/core';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { WishListModel } from '../../services/wishlists/wishlists.model';
import { GlobalState } from '../../services/global.state';

@Component({
    selector: 'is-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent {
    globalnav: boolean = true;
    cartItemLength: number;

    constructor(private wishListService: WishListService, private globalState: GlobalState) {
        this.globalState.subscribe('customerDetails', (customerDetails) => {
            if (customerDetails) {
                this.wishListService.getWishList().subscribe(_ => _);
            } else {
                this.globalState.notifyDataChanged('wishListStatus', customerDetails);
            }
        });

        this.globalState.subscribe('cartData', (cartItems) => {
            this.cartItemLength = cartItems.length;
        });
    }

}