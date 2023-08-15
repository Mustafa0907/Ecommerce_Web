import { Moment } from 'moment';

export interface ISellingProduct {
  id?: number;
  createdondate?: Moment;
  name?: string;
  brand?: string;
  category?: string;
  details?: string;
  expectedPrice?: string;
  userid?: number;
}

export class SellingProduct implements ISellingProduct {
  constructor(
    public id?: number,
    public createdondate?: Moment,
    public name?: string,
    public brand?: string,
    public category?: string,
    public details?: string,
    public expectedPrice?: string,
    public userid?: number
  ) {}
}
