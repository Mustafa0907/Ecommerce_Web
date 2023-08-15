import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';

type EntityResponseType = HttpResponse<ICartProductInv>;
type EntityArrayResponseType = HttpResponse<ICartProductInv[]>;

@Injectable({ providedIn: 'root' })
export class CartProductInvService {
  public resourceUrl = SERVER_API_URL + 'api/cart-product-invs';
  public userresourceUrl = SERVER_API_URL + 'api/user/cart-product-invs/'

  constructor(protected http: HttpClient) { }

  create(cartProductInv: ICartProductInv): Observable<EntityResponseType> {
    return this.http.post<ICartProductInv>(this.resourceUrl, cartProductInv, { observe: 'response' });
  }

  update(cartProductInv: ICartProductInv): Observable<EntityResponseType> {
    return this.http.put<ICartProductInv>(this.resourceUrl, cartProductInv, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICartProductInv>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICartProductInv[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addToCart(productId: number, quantity: number): Observable<HttpResponse<{}>> {
    return this.http.post(`${this.userresourceUrl}${productId}?quantity=${quantity}`, null, { observe: 'response' });
  }

  findAllByCart(): Observable<EntityArrayResponseType> {
    return this.http.get<ICartProductInv[]>(`${this.userresourceUrl}`, { observe: 'response' });
  }

  incrementItemQuantity(productId: number): Observable<HttpResponse<{}>> {
    return this.http.put(`${this.userresourceUrl}increment/${productId}`, null, { observe: 'response' });
  }

  decrementItemQuantity(productId: number): Observable<HttpResponse<{}>> {
    return this.http.put(`${this.userresourceUrl}decrement/${productId}`, null, { observe: 'response' });
  }

  getTotalAmountPerProduct(): Observable<Map<number, number>> {
    return this.http.get<Map<number, number>>(`${this.userresourceUrl}totalAmountPerProduct`);
  }


}
