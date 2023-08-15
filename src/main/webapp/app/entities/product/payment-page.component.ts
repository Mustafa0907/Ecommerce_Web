import { Component, OnInit, OnDestroy, NgModule, TemplateRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ICartProductInv } from 'app/shared/model/cart-product-inv.model';

import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { CartProductInvService } from '../cart-product-inv/cart-product-inv.service';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import 'datatables.net';



@Component({
  selector: 'jhi-product',
  templateUrl: './payment-page.component.html'
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  products?: IProduct[];
  eventSubscriber?: Subscription;
  cartProductInvs?: ICartProductInv[]
  map :any;
  // totalAmountPerProduct :any;
  amountPerProduct: any;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  quantity: number = 3;

  constructor(protected notification: NzNotificationService,protected cartProductInvService: CartProductInvService ,protected productService: ProductService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {
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
    $('#myTable').DataTable({
        "paging": true,
        "order": [[0, "asc"]]
    });
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
  
}
