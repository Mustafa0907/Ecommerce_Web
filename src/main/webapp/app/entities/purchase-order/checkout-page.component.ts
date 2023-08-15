import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../payment/payment.service';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderItemService } from '../order-item/order-item.service';

@Component({
  selector: 'jhi-purchase-order-detail',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
  purchaseOrder: IPurchaseOrder | null = null;
  totalamount?: number;
  paymentChecked?: boolean = false;
  debug?: any;
  cardNumber?: string;
  errorResponse = false;
  errormsg = "";
  constructor(private orderItemService: OrderItemService, private fm: FormsModule, private router: Router, protected notification: NzNotificationService, private paymentService: PaymentService, protected activatedRoute: ActivatedRoute) {
    // this.paymentChecked = false;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseOrder }) => (this.purchaseOrder = purchaseOrder));
    this.totalamount = this.purchaseOrder?.total;
    if (this.purchaseOrder) {
      if (this.purchaseOrder.status === 'Paid') {
        // this.notification.template(template);
        this.paymentChecked = true;
      }
    }
    window.addEventListener('popstate', this.handlePopstate.bind(this));

    // this.paymentChecked = false;
  }

  previousState(): void {
    window.history.back();
  }

  makePayment(template: TemplateRef<{}>, template2: TemplateRef<{}>, cardNumber: string): void {

    if (cardNumber !== '4242424242424242') {
      this.errorResponse = true;
      this.errormsg = "Incorrect Card! Please try again.."
      return;
    }
    if (this.paymentChecked === true) {
      this.notification.template(template2);
      this.router.navigate(['/product/home']);
      return;
    }

    const paymentData = {
      number: cardNumber,
      // '4242424242424242'
      // eslint-disable-next-line @typescript-eslint/camelcase
      exp_month: 3,
      // eslint-disable-next-line @typescript-eslint/camelcase
      exp_year: 2024,
      cvc: '314',
      amount: this.totalamount
    };
    // paymentData.number = this.cardNumber;

    this.paymentService.createPaymentAndChargeCard(paymentData)
      .subscribe();
    this.notification.template(template);
    this.paymentChecked = true;


    this.router.navigate(['/product/home']);

    // if (this.purchaseOrder){
    //   if (this.purchaseOrder.status === 'Paid') {


    //   }
    // }

  }

  removePurchaseOrder(): void {
    if (!this.paymentChecked) {
      this.orderItemService.removePurchaseOrder(this.purchaseOrder?.id!).subscribe(
        () => {
          // Success handling
          // console.log('Purchase order removed successfully');
        },
        (error) => {
          // Error handling
          // console.error('Failed to remove purchase order:', error);
        }
      );
      // this.router.navigate(['/product/cart'])
    }
    this.router.navigate(['/product/cart'])
  }
  handlePopstate(event: PopStateEvent): void {
    // Call the 'removePurchaseOrder' function when the browser's back button is clicked
    this.removePurchaseOrder();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event): void {
    // Clean up the 'popstate' event listener
    window.removeEventListener('popstate', this.handlePopstate.bind(this));
  }
}
