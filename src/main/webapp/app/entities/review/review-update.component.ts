import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IReview, Review } from 'app/shared/model/review.model';
import { ReviewService } from './review.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';

@Component({
  selector: 'jhi-review-update',
  templateUrl: './review-update.component.html'
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;
  products: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    createdondate: [],
    rating: [],
    reviewText: [],
    userid: [],
    product: []
  });

  constructor(
    protected reviewService: ReviewService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      if (!review.id) {
        const today = moment().startOf('day');
        review.createdondate = today;
      }

      this.updateForm(review);

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    });
  }

  updateForm(review: IReview): void {
    this.editForm.patchValue({
      id: review.id,
      createdondate: review.createdondate ? review.createdondate.format(DATE_TIME_FORMAT) : null,
      rating: review.rating,
      reviewText: review.reviewText,
      userid: review.userid,
      product: review.product
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.createFromForm();
    if (review.id !== undefined) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  private createFromForm(): IReview {
    return {
      ...new Review(),
      id: this.editForm.get(['id'])!.value,
      createdondate: this.editForm.get(['createdondate'])!.value
        ? moment(this.editForm.get(['createdondate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      rating: this.editForm.get(['rating'])!.value,
      reviewText: this.editForm.get(['reviewText'])!.value,
      userid: this.editForm.get(['userid'])!.value,
      product: this.editForm.get(['product'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IProduct): any {
    return item.id;
  }
}
