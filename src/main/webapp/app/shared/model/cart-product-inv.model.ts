import { IProduct } from 'app/shared/model/product.model';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';

export interface ICartProductInv {
  id?: number;
  quantity?: number;
  product?: IProduct;
  shoppingCart?: IShoppingCart;
}

export class CartProductInv implements ICartProductInv {
  constructor(public id?: number, public quantity?: number, public product?: IProduct, public shoppingCart?: IShoppingCart) {}
}
