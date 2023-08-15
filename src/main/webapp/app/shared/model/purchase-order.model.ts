import { Moment } from 'moment';
import { IPayment } from 'app/shared/model/payment.model';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';

export interface IPurchaseOrder {
  id?: number;
  createdondate?: Moment;
  status?: string;
  total?: number;
  paymentMethod?: string;
  userid?: number;
  payment?: IPayment;
  shoppingCart?: IShoppingCart;
}

export class PurchaseOrder implements IPurchaseOrder {
  constructor(
    public id?: number,
    public createdondate?: Moment,
    public status?: string,
    public total?: number,
    public paymentMethod?: string,
    public userid?: number,
    public payment?: IPayment,
    public shoppingCart?: IShoppingCart
  ) {}
}
