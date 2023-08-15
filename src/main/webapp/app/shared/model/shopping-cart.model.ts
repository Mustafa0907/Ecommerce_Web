import { Moment } from 'moment';

export interface IShoppingCart {
  id?: number;
  createdondate?: Moment;
  userid?: number;
}

export class ShoppingCart implements IShoppingCart {
  constructor(public id?: number, public createdondate?: Moment, public userid?: number) {}
}
