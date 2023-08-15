import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { Pagination, createRequestOption } from 'app/shared/util/request-util';
import { IProduct } from 'app/shared/model/product.model';

type EntityResponseType = HttpResponse<IProduct>;
type EntityArrayResponseType = HttpResponse<IProduct[]>;
type EntityPageResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  public resourceUrl = SERVER_API_URL + 'api/products';
  public userresourceUrl = SERVER_API_URL + 'api/user/products';
  constructor(protected http: HttpClient) {}

  create(product: IProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .post<IProduct>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(product: IProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .put<IProduct>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  query2(req?: Pagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  // query(req?: any, pageable?: Pageable): Observable<EntityPageResponseType> {
  //   const options = createRequestOption(req, pageable);
  //   return this.http
  //     .get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
  //     .pipe(map((res: EntityPageResponseType) => this.convertDateArrayFromServer(res)));
  // }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(product: IProduct): IProduct {
    const copy: IProduct = Object.assign({}, product, {
      createdondate: product.createdondate && product.createdondate.isValid() ? product.createdondate.toJSON() : undefined
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
      res.body.forEach((product: IProduct) => {
        product.createdondate = product.createdondate ? moment(product.createdondate) : undefined;
      });
    }
    return res;
  }
  searchProducts(name?: string, category?: string): Observable<IProduct[]> {
    let url = `${this.userresourceUrl}/search`;

    if (name && category) {
      url += `?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
    } else if (name) {
      url += `?name=${encodeURIComponent(name)}`;
    } else if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    return this.http.get<IProduct[]>(url);
  }
}
