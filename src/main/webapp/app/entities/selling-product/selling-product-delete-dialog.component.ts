import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISellingProduct } from 'app/shared/model/selling-product.model';
import { SellingProductService } from './selling-product.service';

@Component({
  templateUrl: './selling-product-delete-dialog.component.html'
})
export class SellingProductDeleteDialogComponent {
  sellingProduct?: ISellingProduct;

  constructor(
    protected sellingProductService: SellingProductService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sellingProductService.delete(id).subscribe(() => {
      this.eventManager.broadcast('sellingProductListModification');
      this.activeModal.close();
    });
  }
}
