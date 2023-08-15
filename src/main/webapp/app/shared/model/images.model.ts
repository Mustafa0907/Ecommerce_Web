import { IProduct } from 'app/shared/model/product.model';

export interface IImages {
  id?: number;
  imagePath?: string;
  product?: IProduct;
}

export class Images implements IImages {
  constructor(public id?: number, public imagePath?: string, public product?: IProduct) {}
}
