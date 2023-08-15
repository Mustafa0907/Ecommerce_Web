import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { PurchaseOrderService } from './purchase-order.service';

@Component({
  templateUrl: './purchase-order-delete-dialog.component.html'
})
export class PurchaseOrderDeleteDialogComponent {
  purchaseOrder?: IPurchaseOrder;

  constructor(
    protected purchaseOrderService: PurchaseOrderService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.purchaseOrderService.delete(id).subscribe(() => {
      this.eventManager.broadcast('purchaseOrderListModification');
      this.activeModal.close();
    });
  }
}
