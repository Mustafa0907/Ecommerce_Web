import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPurchaseOrder, PurchaseOrder } from 'app/shared/model/purchase-order.model';
import { PurchaseOrderService } from './purchase-order.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from 'app/entities/shopping-cart/shopping-cart.service';

type SelectableEntity = IPayment | IShoppingCart;

@Component({
  selector: 'jhi-purchase-order-update',
  templateUrl: './purchase-order-update.component.html'
})
export class PurchaseOrderUpdateComponent implements OnInit {
  isSaving = false;
  payments: IPayment[] = [];
  shoppingcarts: IShoppingCart[] = [];

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    status: [],
    total: [],
    paymentMethod: [],
    userid: [],
    payment: [],
    shoppingCart: []
  });

  constructor(
    protected purchaseOrderService: PurchaseOrderService,
    protected paymentService: PaymentService,
    protected shoppingCartService: ShoppingCartService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseOrder }) => {
      if (!purchaseOrder.id) {
        const today = moment().startOf('day');
        purchaseOrder.createdondate = today;
      }

      this.updateForm(purchaseOrder);

      this.paymentService
        .query({ filter: 'purchaseorder-is-null' })
        .pipe(
          map((res: HttpResponse<IPayment[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IPayment[]) => {
          if (!purchaseOrder.payment || !purchaseOrder.payment.id) {
            this.payments = resBody;
          } else {
            this.paymentService
              .find(purchaseOrder.payment.id)
              .pipe(
                map((subRes: HttpResponse<IPayment>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IPayment[]) => (this.payments = concatRes));
          }
        });

      this.shoppingCartService.query().subscribe((res: HttpResponse<IShoppingCart[]>) => (this.shoppingcarts = res.body || []));
    });
  }

  updateForm(purchaseOrder: IPurchaseOrder): void {
    this.editForm.patchValue({
      id: purchaseOrder.id,
      createdondate: purchaseOrder.createdondate ? purchaseOrder.createdondate.format(DATE_TIME_FORMAT) : null,
      status: purchaseOrder.status,
      total: purchaseOrder.total,
      paymentMethod: purchaseOrder.paymentMethod,
      userid: purchaseOrder.userid,
      payment: purchaseOrder.payment,
      shoppingCart: purchaseOrder.shoppingCart
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseOrder = this.createFromForm();
    if (purchaseOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.purchaseOrderService.update(purchaseOrder));
    } else {
      this.subscribeToSaveResponse(this.purchaseOrderService.create(purchaseOrder));
    }
  }

  private createFromForm(): IPurchaseOrder {
    return {
      ...new PurchaseOrder(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      total: this.editForm.get(['total'])!.value,
      paymentMethod: this.editForm.get(['paymentMethod'])!.value,
      userid: this.editForm.get(['userid'])!.value,
      payment: this.editForm.get(['payment'])!.value,
      shoppingCart: this.editForm.get(['shoppingCart'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseOrder>>): void {
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
