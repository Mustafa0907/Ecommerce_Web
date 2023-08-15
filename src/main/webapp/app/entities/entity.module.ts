import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.EcommerceWebAppProductModule)
      },
      {
        path: 'order-item',
        loadChildren: () => import('./order-item/order-item.module').then(m => m.EcommerceWebAppOrderItemModule)
      },
      {
        path: 'selling-product',
        loadChildren: () => import('./selling-product/selling-product.module').then(m => m.EcommerceWebAppSellingProductModule)
      },
      {
        path: 'cart-product-inv',
        loadChildren: () => import('./cart-product-inv/cart-product-inv.module').then(m => m.EcommerceWebAppCartProductInvModule)
      },
      {
        path: 'images',
        loadChildren: () => import('./images/images.module').then(m => m.EcommerceWebAppImagesModule)
      },
      {
        path: 'shopping-cart',
        loadChildren: () => import('./shopping-cart/shopping-cart.module').then(m => m.EcommerceWebAppShoppingCartModule)
      },
      {
        path: 'purchase-order',
        loadChildren: () => import('./purchase-order/purchase-order.module').then(m => m.EcommerceWebAppPurchaseOrderModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.EcommerceWebAppPaymentModule)
      },
      {
        path: 'review',
        loadChildren: () => import('./review/review.module').then(m => m.EcommerceWebAppReviewModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class EcommerceWebAppEntityModule {}
