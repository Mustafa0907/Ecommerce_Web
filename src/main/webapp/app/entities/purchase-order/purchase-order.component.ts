import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderDeleteDialogComponent } from './purchase-order-delete-dialog.component';

@Component({
  selector: 'jhi-purchase-order',
  templateUrl: './purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {
  purchaseOrders?: IPurchaseOrder[];
  eventSubscriber?: Subscription;

  constructor(
    protected purchaseOrderService: PurchaseOrderService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.purchaseOrderService.query().subscribe((res: HttpResponse<IPurchaseOrder[]>) => (this.purchaseOrders = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPurchaseOrders();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPurchaseOrder): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPurchaseOrders(): void {
    this.eventSubscriber = this.eventManager.subscribe('purchaseOrderListModification', () => this.loadAll());
  }

  delete(purchaseOrder: IPurchaseOrder): void {
    const modalRef = this.modalService.open(PurchaseOrderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.purchaseOrder = purchaseOrder;
  }
}
