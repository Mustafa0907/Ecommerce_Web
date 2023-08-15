import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IOrderItem, OrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { PurchaseOrderService } from 'app/entities/purchase-order/purchase-order.service';

type SelectableEntity = IProduct | IPurchaseOrder;

@Component({
  selector: 'jhi-order-item-update',
  templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
  isSaving = false;
  products: IProduct[] = [];
  purchaseorders: IPurchaseOrder[] = [];

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    quantity: [],
    product: [],
    purchaseOrder: []
  });

  constructor(
    protected orderItemService: OrderItemService,
    protected productService: ProductService,
    protected purchaseOrderService: PurchaseOrderService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderItem }) => {
      if (!orderItem.id) {
        const today = moment().startOf('day');
        orderItem.createdondate = today;
      }

      this.updateForm(orderItem);

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));

      this.purchaseOrderService.query().subscribe((res: HttpResponse<IPurchaseOrder[]>) => (this.purchaseorders = res.body || []));
    });
  }

  updateForm(orderItem: IOrderItem): void {
    this.editForm.patchValue({
      id: orderItem.id,
      createdondate: orderItem.createdondate ? orderItem.createdondate.format(DATE_TIME_FORMAT) : null,
      quantity: orderItem.quantity,
      product: orderItem.product,
      purchaseOrder: orderItem.purchaseOrder
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderItem = this.createFromForm();
    if (orderItem.id !== undefined) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  private createFromForm(): IOrderItem {
    return {
      ...new OrderItem(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      quantity: this.editForm.get(['quantity'])!.value,
      product: this.editForm.get(['product'])!.value,
      purchaseOrder: this.editForm.get(['purchaseOrder'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>): void {
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
