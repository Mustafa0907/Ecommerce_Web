import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISellingProduct } from 'app/shared/model/selling-product.model';
import { SellingProductService } from './selling-product.service';
import { SellingProductDeleteDialogComponent } from './selling-product-delete-dialog.component';

@Component({
  selector: 'jhi-selling-product',
  templateUrl: './selling-product.component.html'
})
export class SellingProductComponent implements OnInit, OnDestroy {
  sellingProducts?: ISellingProduct[];
  eventSubscriber?: Subscription;

  constructor(
    protected sellingProductService: SellingProductService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.sellingProductService.query().subscribe((res: HttpResponse<ISellingProduct[]>) => (this.sellingProducts = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInSellingProducts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ISellingProduct): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInSellingProducts(): void {
    this.eventSubscriber = this.eventManager.subscribe('sellingProductListModification', () => this.loadAll());
  }

  delete(sellingProduct: ISellingProduct): void {
    const modalRef = this.modalService.open(SellingProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sellingProduct = sellingProduct;
  }
}
