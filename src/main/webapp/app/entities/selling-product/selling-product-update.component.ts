import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { ISellingProduct, SellingProduct } from 'app/shared/model/selling-product.model';
import { SellingProductService } from './selling-product.service';

@Component({
  selector: 'jhi-selling-product-update',
  templateUrl: './selling-product-update.component.html'
})
export class SellingProductUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    name: [],
    brand: [],
    category: [],
    details: [],
    expectedPrice: [],
    userid: []
  });

  constructor(protected sellingProductService: SellingProductService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sellingProduct }) => {
      if (!sellingProduct.id) {
        const today = moment().startOf('day');
        sellingProduct.createdondate = today;
      }

      this.updateForm(sellingProduct);
    });
  }

  updateForm(sellingProduct: ISellingProduct): void {
    this.editForm.patchValue({
      id: sellingProduct.id,
      createdondate: sellingProduct.createdondate ? sellingProduct.createdondate.format(DATE_TIME_FORMAT) : null,
      name: sellingProduct.name,
      brand: sellingProduct.brand,
      category: sellingProduct.category,
      details: sellingProduct.details,
      expectedPrice: sellingProduct.expectedPrice,
      userid: sellingProduct.userid
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sellingProduct = this.createFromForm();
    if (sellingProduct.id !== undefined) {
      this.subscribeToSaveResponse(this.sellingProductService.update(sellingProduct));
    } else {
      this.subscribeToSaveResponse(this.sellingProductService.create(sellingProduct));
    }
  }

  private createFromForm(): ISellingProduct {
    return {
      ...new SellingProduct(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      name: this.editForm.get(['name'])!.value,
      brand: this.editForm.get(['brand'])!.value,
      category: this.editForm.get(['category'])!.value,
      details: this.editForm.get(['details'])!.value,
      expectedPrice: this.editForm.get(['expectedPrice'])!.value,
      userid: this.editForm.get(['userid'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISellingProduct>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
