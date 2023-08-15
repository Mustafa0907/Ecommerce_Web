import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IShoppingCart, ShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'jhi-shopping-cart-update',
  templateUrl: './shopping-cart-update.component.html'
})
export class ShoppingCartUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    userid: []
  });

  constructor(protected shoppingCartService: ShoppingCartService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shoppingCart }) => {
      if (!shoppingCart.id) {
        const today = moment().startOf('day');
        shoppingCart.createdondate = today;
      }

      this.updateForm(shoppingCart);
    });
  }

  updateForm(shoppingCart: IShoppingCart): void {
    this.editForm.patchValue({
      id: shoppingCart.id,
      createdondate: shoppingCart.createdondate ? shoppingCart.createdondate.format(DATE_TIME_FORMAT) : null,
      userid: shoppingCart.userid
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shoppingCart = this.createFromForm();
    if (shoppingCart.id !== undefined) {
      this.subscribeToSaveResponse(this.shoppingCartService.update(shoppingCart));
    } else {
      this.subscribeToSaveResponse(this.shoppingCartService.create(shoppingCart));
    }
  }

  private createFromForm(): IShoppingCart {
    return {
      ...new ShoppingCart(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      userid: this.editForm.get(['userid'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingCart>>): void {
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
