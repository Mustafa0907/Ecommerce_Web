import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReview } from 'app/shared/model/review.model';
import { ReviewService } from './review.service';
import { ReviewDeleteDialogComponent } from './review-delete-dialog.component';

@Component({
  selector: 'jhi-review',
  templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit, OnDestroy {
  reviews?: IReview[];
  eventSubscriber?: Subscription;

  constructor(protected reviewService: ReviewService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.reviewService.query().subscribe((res: HttpResponse<IReview[]>) => (this.reviews = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInReviews();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IReview): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInReviews(): void {
    this.eventSubscriber = this.eventManager.subscribe('reviewListModification', () => this.loadAll());
  }

  delete(review: IReview): void {
    const modalRef = this.modalService.open(ReviewDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.review = review;
  }
}
