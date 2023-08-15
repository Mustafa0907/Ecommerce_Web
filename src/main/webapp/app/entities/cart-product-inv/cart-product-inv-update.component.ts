import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICartProductInv, CartProductInv } from 'app/shared/model/cart-product-inv.model';
import { CartProductInvService } from './cart-product-inv.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from 'app/entities/shopping-cart/shopping-cart.service';

type SelectableEntity = IProduct | IShoppingCart;

@Component({
  selector: 'jhi-cart-product-inv-update',
  templateUrl: './cart-product-inv-update.component.html'
})
export class CartProductInvUpdateComponent implements OnInit {
  isSaving = false;
  products: IProduct[] = [];
  shoppingcarts: IShoppingCart[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    product: [],
    shoppingCart: []
  });

  constructor(
    protected cartProductInvService: CartProductInvService,
    protected productService: ProductService,
    protected shoppingCartService: ShoppingCartService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cartProductInv }) => {
      this.updateForm(cartProductInv);

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));

      this.shoppingCartService.query().subscribe((res: HttpResponse<IShoppingCart[]>) => (this.shoppingcarts = res.body || []));
    });
  }

  updateForm(cartProductInv: ICartProductInv): void {
    this.editForm.patchValue({
      id: cartProductInv.id,
      quantity: cartProductInv.quantity,
      product: cartProductInv.product,
      shoppingCart: cartProductInv.shoppingCart
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cartProductInv = this.createFromForm();
    if (cartProductInv.id !== undefined) {
      this.subscribeToSaveResponse(this.cartProductInvService.update(cartProductInv));
    } else {
      this.subscribeToSaveResponse(this.cartProductInvService.create(cartProductInv));
    }
  }

  private createFromForm(): ICartProductInv {
    return {
      ...new CartProductInv(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      product: this.editForm.get(['product'])!.value,
      shoppingCart: this.editForm.get(['shoppingCart'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICartProductInv>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
