import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';

@Component({
  selector: 'jhi-cart-product-inv-detail',
  templateUrl: './cart-product-inv-detail.component.html'
})
export class CartProductInvDetailComponent implements OnInit {
  cartProductInv: ICartProductInv | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cartProductInv }) => (this.cartProductInv = cartProductInv));
  }

  previousState(): void {
    window.history.back();
  }
}
