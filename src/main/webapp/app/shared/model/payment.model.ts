import { Moment } from 'moment';

export interface IPayment {
  id?: number;
  createdondate?: Moment;
  amount?: number;
  status?: string;
  userid?: number;
}

export class Payment implements IPayment {
  constructor(public id?: number, public createdondate?: Moment, public amount?: number, public status?: string, public userid?: number) {}
}
