import { Component, OnInit, OnDestroy, NgModule, TemplateRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { IPurchaseOrder } from 'app/shared/model/purchase-order.model';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { CartProductInvService } from '../cart-product-inv/cart-product-inv.service';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import 'datatables.net';



@Component({
  selector: 'jhi-product',
  templateUrl: './view-cart.component.html'
})
export class ViewCartComponent implements OnInit, OnDestroy {
  products?: IProduct[];
  eventSubscriber?: Subscription;
  cartProductInvs?: ICartProductInv[]
  map :any;
  errorMessage = "";
  purchaseOrderId: any;
  // totalAmountPerProduct :any;
  amountPerProduct: any;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  quantity: number = 3;

  constructor(private router: Router,private purchaseOrderService: PurchaseOrderService, protected notification: NzNotificationService,protected cartProductInvService: CartProductInvService ,protected productService: ProductService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {
    // this.map.set(1,3);
    // this.map.set(2,3);
  }

  loadAll(): void {
    this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    this.findAllByCart();
    this.getTotalAmount();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProducts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  ngAfterViewInit(): void {
    // $('#myTable').DataTable({
    //     "paging": true,
    //     "order": [[0, "asc"]]
    // });
  }
  

  incrementQuantity(): void{
    this.quantity++;
  }

  decrementQuantity(): void {
    this.quantity--;
  }

  trackId(index: number, item: IProduct): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProducts(): void {
    this.eventSubscriber = this.eventManager.subscribe('productListModification', () => this.loadAll());
  }

  delete(product: IProduct): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
  }

  findAllByCart(): void {
    this.cartProductInvService.findAllByCart().subscribe((res: HttpResponse<ICartProductInv[]>) => {
      this.cartProductInvs = res.body || [];
    });
  }

  updateQuantity(productId: number, action: string): void {
    if (action === 'increment') {
      this.cartProductInvService.incrementItemQuantity(productId).subscribe(() => {
        // Quantity updated successfully, update the cartProductInvs array
        this.findAllByCart();
        this.getTotalAmount();
      });
    } else if (action === 'decrement') {
      this.cartProductInvService.decrementItemQuantity(productId).subscribe(() => {
        // Quantity updated successfully, update the cartProductInvs array
        this.findAllByCart();
        this.getTotalAmount();
      });
    }
  }
  getTotalAmount():void{
    // this.cartProductInvService.getTotalAmountPerProduct().subscribe(response => {
    //   this.map = new Map(response);
      
    // });
    this.cartProductInvService.getTotalAmountPerProduct().subscribe({
      next: (response: Map<number, number>) => {
        this.map = response;
      }});
    
  }

  createPurchaseOrder(paymentMethod: string) {
    // const purchaseOrderId =  undefined; // Declare the purchaseOrderId variable
    
      this.purchaseOrderService.createPurchaseOrderWithCart(paymentMethod)
        .subscribe((response) => {
          // Handle the successful response here
          // console.log('Purchase order created successfully:');
          if (response.body?.id) {
            this.purchaseOrderId = response.body.id;
            this.router.navigate(['/purchase-order', this.purchaseOrderId, 'checkout']);
          }
          // this.errorMessage = response.body?.id;
          // this.router.navigate(['/purchase-order/', purchaseOrderId,'/checkout']);

        },
        (error) => {
          // Handle the error here
          this.errorMessage = "One Unpaid Purchase Order Already in Cart, Proceed it or Delete it. Go to My-orders"
          // console.error('Failed to create purchase order:', error);
          // this.errorMessage = 'Previous purchase order is unpaid';
        }
        
        );
        // tslint:disable-next-line:no-console
        // console.log(this.purchaseOrderId);
        // this.router.navigate(['/purchase-order/', this.purchaseOrderId,'/checkout']);

    
  }
  
}
