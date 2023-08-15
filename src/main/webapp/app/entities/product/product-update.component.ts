import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html'
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    name: [],
    price: [],
    brand: [],
    totalquantity: [],
    category: [],
    specs: []
  });

  constructor(protected productService: ProductService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      if (!product.id) {
        const today = moment().startOf('day');
        product.createdondate = today;
      }

      this.updateForm(product);
    });
  }

  updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      createdondate: product.createdondate ? product.createdondate.format(DATE_TIME_FORMAT) : null,
      name: product.name,
      price: product.price,
      brand: product.brand,
      totalquantity: product.totalquantity,
      category: product.category,
      specs: product.specs
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      name: this.editForm.get(['name'])!.value,
      price: this.editForm.get(['price'])!.value,
      brand: this.editForm.get(['brand'])!.value,
      totalquantity: this.editForm.get(['totalquantity'])!.value,
      category: this.editForm.get(['category'])!.value,
      specs: this.editForm.get(['specs'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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
