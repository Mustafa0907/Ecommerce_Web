import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';

export interface IOrderItem {
  id?: number;
  createdondate?: Moment;
  quantity?: number;
  product?: IProduct;
  purchaseOrder?: IPurchaseOrder;
}

export class OrderItem implements IOrderItem {
  constructor(
    public id?: number,
    public createdondate?: Moment,
    public quantity?: number,
    public product?: IProduct,
    public purchaseOrder?: IPurchaseOrder
  ) {}
}
