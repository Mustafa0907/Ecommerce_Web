import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISellingProduct } from 'app/shared/model/selling-product.model';

@Component({
  selector: 'jhi-selling-product-detail',
  templateUrl: './selling-product-detail.component.html'
})
export class SellingProductDetailComponent implements OnInit {
  sellingProduct: ISellingProduct | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sellingProduct }) => (this.sellingProduct = sellingProduct));
  }

  previousState(): void {
    window.history.back();
  }
}
