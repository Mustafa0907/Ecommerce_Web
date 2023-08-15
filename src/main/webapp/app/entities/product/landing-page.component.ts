import { Component, OnInit, OnDestroy, NgModule, TemplateRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { createRequestOption, Pagination } from 'app/shared/util/request-util';

import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from './product.service'; 
import { CartProductInvService } from '../cart-product-inv/cart-product-inv.service';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'jhi-product',
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  // products2: IProduct[] = [];
  eventSubscriber?: Subscription;
  showAlert = false;
  alertMessage = '';
  alertDescription = '';
  arrayOfImgUrls = [
    '../../../content/images/ss-1.png',
    '../../../content/images/ss-2.png',
    '../../../content/images/ss-3.png',
    '../../../content/images/ss-4.png'
    
  ]
  array = ["../../../content/images/ss-1.png", "../../../content/images/ss-2.png", "../../../content/images/ss-3.png", "../../../content/images/ss-4.png"];

  currentPageIndex = 1;
  itemsPerPage = 4;
  pagination: Pagination = {
    page: 0,
    size: 4,
    sort: ['id,asc'] // Default sort value
  };
  totalItems = this.products.length; // Total number of items
  // itemsPerPage = 10; // Number of items to display per page
  page = 0; // Current page
  // totalProducts = 7;
  name = '';
  category = '';

  // pager = {
  //   currentPage: 1,
  //   totalPages: 0,
  //   pageSize: 5, // set the number of products to display per page
  //   totalItems: 0,
  //   pages: [] as number[]
  // };

  constructor(protected notification: NzNotificationService,protected cartProductInvService: CartProductInvService ,protected productService: ProductService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.productService.query2().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    // this.totalItems = this.products2.length;
  }

  ngOnInit(): void {
    this.loadAll();

    this.registerChangeInProducts();
    // this.setPage(1);
    // this.getProductCount();
    // this.loadPage();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }
  // getProductCount(): void{
  //   if(this.products){
  //     this.totalProducts = this.products.length;
  //   }
  // }

  trackId(index: number, item: IProduct): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProducts(): void {
    this.eventSubscriber = this.eventManager.subscribe('productListModification', () => this.loadAll());
    // this.totalItems = this.products2.length;
  }

  delete(product: IProduct): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
  }

  addToCart(productId: number, quantity: number,template: TemplateRef<{}>): void {
    this.cartProductInvService.addToCart(productId, quantity).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log('Item added to cart successfully!');
      this.notification.template(template);
        }, error => {
      // eslint-disable-next-line no-console
      console.error('Error adding item to cart:', error);
    });
  }
    

  showSuccessAlert(): void {
    // this.alertMessage = 'Item added to cart successfully!';
    // // this.alertDescription = '';
    // this.showAlert = true;
    this.notification.blank(
      'Notification Title',
      'Item added to cart successfully!',
      { nzDuration: 25 }
    );
  }
  
  // loadPage(): void {
  //   const options = {
  //     page: this.pagination.page,
  //     size: this.pagination.size,
  //     sort: this.pagination.sort
  //   };
  //   this.productService.query(options)
  //     .subscribe((res) => {
  //       this.products = res.body || [];
  //     });
  // }
  // changePage(event: any): void {
  //   this.page = event.page - 1; // Adjusting to 0-based index
  //   this.loadPage();
  // }

  search(): void {
    this.productService.searchProducts(this.name, this.category)
      .subscribe(
        (data: IProduct[]) => {
          this.products = data;
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }
  
}
