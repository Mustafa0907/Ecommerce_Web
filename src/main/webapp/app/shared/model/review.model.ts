import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';

export interface IReview {
  id?: number;
  createdondate?: Moment;
  rating?: number;
  reviewText?: string;
  userid?: number;
  product?: IProduct ;
}

export class Review implements IReview {
  constructor(
    public id?: number,
    public createdondate?: Moment,
    public rating?: number,
    public reviewText?: string,
    public userid?: number,
    public product?: IProduct
  ) {}
}
