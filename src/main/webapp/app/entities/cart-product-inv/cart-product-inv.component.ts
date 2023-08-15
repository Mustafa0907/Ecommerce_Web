import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';
import { CartProductInvService } from './cart-product-inv.service';
import { CartProductInvDeleteDialogComponent } from './cart-product-inv-delete-dialog.component';

@Component({
  selector: 'jhi-cart-product-inv',
  templateUrl: './cart-product-inv.component.html'
})
export class CartProductInvComponent implements OnInit, OnDestroy {
  cartProductInvs?: ICartProductInv[];
  eventSubscriber?: Subscription;

  constructor(
    protected cartProductInvService: CartProductInvService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.cartProductInvService.query().subscribe((res: HttpResponse<ICartProductInv[]>) => (this.cartProductInvs = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInCartProductInvs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ICartProductInv): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInCartProductInvs(): void {
    this.eventSubscriber = this.eventManager.subscribe('cartProductInvListModification', () => this.loadAll());
  }

  delete(cartProductInv: ICartProductInv): void {
    const modalRef = this.modalService.open(CartProductInvDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cartProductInv = cartProductInv;
  }
}
