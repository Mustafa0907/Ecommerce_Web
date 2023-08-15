import { Moment } from 'moment';
import { IImages } from 'app/shared/model/images.model';

export interface IProduct {
  id?: number;
  createdondate?: Moment;
  name?: string;
  price?: number;
  brand?: string;
  totalquantity?: number;
  category?: string;
  specs?: string;
  images?: IImages[];
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public createdondate?: Moment,
    public name?: string,
    public price?: number,
    public brand?: string,
    public totalquantity?: number,
    public category?: string,
    public specs?: string,
    public images?: IImages[]
  ) {}
}
