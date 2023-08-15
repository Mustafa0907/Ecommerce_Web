import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';

type EntityResponseType = HttpResponse<IPurchaseOrder>;
type EntityArrayResponseType = HttpResponse<IPurchaseOrder[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  public resourceUrl = SERVER_API_URL + 'api/purchase-orders';
  public userresourceUrl = SERVER_API_URL + 'api/user/purchase-orders'
  constructor(protected http: HttpClient) {}

  create(purchaseOrder: IPurchaseOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseOrder);
    return this.http
      .post<IPurchaseOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(purchaseOrder: IPurchaseOrder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchaseOrder);
    return this.http
      .put<IPurchaseOrder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPurchaseOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPurchaseOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(purchaseOrder: IPurchaseOrder): IPurchaseOrder {
    const copy: IPurchaseOrder = Object.assign({}, purchaseOrder, {
      createdondate: purchaseOrder.createdondate && purchaseOrder.createdondate.isValid() ? purchaseOrder.createdondate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdondate = res.body.createdondate ? moment(res.body.createdondate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((purchaseOrder: IPurchaseOrder) => {
        purchaseOrder.createdondate = purchaseOrder.createdondate ? moment(purchaseOrder.createdondate) : undefined;
      });
    }
    return res;
  }

  createPurchaseOrderWithCart(paymentMethod: string): Observable<EntityResponseType> {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const options = createRequestOption({ payment_method: paymentMethod });

    return this.http
      .post<IPurchaseOrder>(`${this.userresourceUrl}/create-with-cart?payment_method=${paymentMethod}`, null, {observe: 'response' })
      // .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  getAllByUser(): Observable<any[]> {
    return this.http.get<any[]>(this.userresourceUrl);
  }
}
