import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';
import { CartProductInvService } from './cart-product-inv.service';

@Component({
  templateUrl: './cart-product-inv-delete-dialog.component.html'
})
export class CartProductInvDeleteDialogComponent {
  cartProductInv?: ICartProductInv;

  constructor(
    protected cartProductInvService: CartProductInvService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cartProductInvService.delete(id).subscribe(() => {
      this.eventManager.broadcast('cartProductInvListModification');
      this.activeModal.close();
    });
  }
}
