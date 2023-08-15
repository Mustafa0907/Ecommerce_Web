import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISellingProduct } from 'app/shared/model/selling-product.model';

type EntityResponseType = HttpResponse<ISellingProduct>;
type EntityArrayResponseType = HttpResponse<ISellingProduct[]>;

@Injectable({ providedIn: 'root' })
export class SellingProductService {
  public resourceUrl = SERVER_API_URL + 'api/selling-products';
  public userresourceUrl = SERVER_API_URL + 'api/user/selling-products';
  constructor(protected http: HttpClient) {}

  create(sellingProduct: ISellingProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sellingProduct);
    return this.http
      .post<ISellingProduct>(this.userresourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sellingProduct: ISellingProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sellingProduct);
    return this.http
      .put<ISellingProduct>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISellingProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISellingProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(sellingProduct: ISellingProduct): ISellingProduct {
    const copy: ISellingProduct = Object.assign({}, sellingProduct, {
      createdondate:
        sellingProduct.createdondate && sellingProduct.createdondate.isValid() ? sellingProduct.createdondate.toJSON() : undefined
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
      res.body.forEach((sellingProduct: ISellingProduct) => {
        sellingProduct.createdondate = sellingProduct.createdondate ? moment(sellingProduct.createdondate) : undefined;
      });
    }
    return res;
  }
}
