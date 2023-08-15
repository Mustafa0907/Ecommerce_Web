import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProduct } from 'app/shared/model/product.model';
import { IReview } from 'app/shared/model/review.model';
import { ReviewService } from 'app/entities/review/review.service';
import { CartProductInvService } from '../cart-product-inv/cart-product-inv.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OrderItemService } from '../order-item/order-item.service';


@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-det.component.html'
})
export class ProductDetComponent implements OnInit {
  product: IProduct | null | undefined = null;
  reviews: IReview[] | null = null; // add a property to hold the reviews
  textValue: string | null = null;
  rating = 0;
  canReview = false;
  panels2 = [
    // {
    //   active: false,
    //   disabled: false,
    //   name: 'Accessories'
    // }
    {
      active: false,
      disabled: true,
      name: 'Condition Grading'
    },
    // {
    //   active: false,
    //   disabled: false,
    //   name: '1 Year Local Warranty'
    // }
  ];
  panels = [
    {
      active: false,
      disabled: false,
      name: 'Accessories'
    }
    // {
    //   active: false,
    //   disabled: true,
    //   name: 'Condition Grading'
    // },
    // {
    //   active: false,
    //   disabled: false,
    //   name: '1 Year Local Warranty'
    // }
  ];
  revText: string | null = null;;
  hoveredRating = 0;

  constructor(private orderitemservice: OrderItemService, protected notification: NzNotificationService, protected cartProductInvService: CartProductInvService, protected activatedRoute: ActivatedRoute, protected reviewService: ReviewService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      if (product) {
        this.product = product;
        this.loadReviews(product.id);
      }
    });
    this.canReviewProduct(this.product?.id!);
  }

  previousState(): void {
    window.history.back();
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviewsByProduct(productId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  addToCart(productId: number, quantity: number, template: TemplateRef<{}>): void {
    this.cartProductInvService.addToCart(productId, quantity).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log('Item added to cart successfully!');
      this.notification.template(template);
    }, error => {
      // eslint-disable-next-line no-console
      console.error('Error adding item to cart:', error);
    });
  }

  submitReview(): void {
    if (this.revText) {
      const review: IReview = {
        reviewText: this.revText,
        rating: this.rating,
        product: this.product!,
      };

      this.reviewService.create(review).subscribe(
        (response) => {
          // console.log('Review created successfully:', response);
          // Optionally, you can reload the reviews after submitting a new review
          this.loadReviews(this.product?.id!);
        },
        (error) => {
          // console.error('Error creating review:', error);
        }
      );
    }
  }
  hoverRating(rating: number) {
    this.hoveredRating = rating;
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  canReviewProduct(productId: number): void {
    this.orderitemservice.hasUserOrderedProduct(productId).subscribe(response => {
      this.canReview = response.body ? true : false;
    });
  }
}
