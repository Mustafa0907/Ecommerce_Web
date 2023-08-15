import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IReview } from 'app/shared/model/review.model';

type EntityResponseType = HttpResponse<IReview>;
type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  public resourceUrl = SERVER_API_URL + 'api/reviews';
  public userresourceUrl = SERVER_API_URL + 'api/user/reviews';

  constructor(protected http: HttpClient) {}

  create(review: IReview): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(review);
    return this.http
      .post<IReview>(this.userresourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(review: IReview): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(review);
    return this.http
      .put<IReview>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReview>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReview[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(review: IReview): IReview {
    const copy: IReview = Object.assign({}, review, {
      createdondate: review.createdondate && review.createdondate.isValid() ? review.createdondate.toJSON() : undefined
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
      res.body.forEach((review: IReview) => {
        review.createdondate = review.createdondate ? moment(review.createdondate) : undefined;
      });
    }
    return res;
  }

  getReviewsByProduct(productId: number): Observable<IReview[]> {
    const url = `${this.resourceUrl}/products/${productId}`;
    return this.http.get<IReview[]>(url);
  }
}
