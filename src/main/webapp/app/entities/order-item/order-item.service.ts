import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrderItem } from 'app/shared/model/order-item.model';

type EntityResponseType = HttpResponse<IOrderItem>;
type EntityArrayResponseType = HttpResponse<IOrderItem[]>;

@Injectable({ providedIn: 'root' })
export class OrderItemService {
  public resourceUrl = SERVER_API_URL + 'api/order-items';
  public userresourceUrl = SERVER_API_URL + 'api/user/order-items';
  constructor(protected http: HttpClient) {}

  create(orderItem: IOrderItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderItem);
    return this.http
      .post<IOrderItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(orderItem: IOrderItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderItem);
    return this.http
      .put<IOrderItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrderItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(orderItem: IOrderItem): IOrderItem {
    const copy: IOrderItem = Object.assign({}, orderItem, {
      createdondate: orderItem.createdondate && orderItem.createdondate.isValid() ? orderItem.createdondate.toJSON() : undefined
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
      res.body.forEach((orderItem: IOrderItem) => {
        orderItem.createdondate = orderItem.createdondate ? moment(orderItem.createdondate) : undefined;
      });
    }
    return res;
  }

  removePurchaseOrder(purchaseOrderId: number): Observable<HttpResponse<{}>> {
    return this.http.put(`${this.userresourceUrl}/${purchaseOrderId}`, null, { observe: 'response' });
  }
  hasUserOrderedProduct(productId: number): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`${this.userresourceUrl}/has-ordered-product/${productId}`, { observe: 'response' });
}
}
