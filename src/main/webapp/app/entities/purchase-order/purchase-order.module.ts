import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { PurchaseOrderUpdateComponent } from './purchase-order-update.component';
import { PurchaseOrderDeleteDialogComponent } from './purchase-order-delete-dialog.component';
import { purchaseOrderRoute } from './purchase-order.route';
import { CheckoutPageComponent } from './checkout-page.component';
import { CommonModule } from '@angular/common';
import { MyOrderComponent } from './my-order.component';

@NgModule({
  imports: [EcommerceWebAppSharedModule, RouterModule.forChild(purchaseOrderRoute), CommonModule],
  declarations: [PurchaseOrderComponent, PurchaseOrderDetailComponent, PurchaseOrderUpdateComponent, PurchaseOrderDeleteDialogComponent, CheckoutPageComponent,MyOrderComponent],
  entryComponents: [PurchaseOrderDeleteDialogComponent]
})
export class EcommerceWebAppPurchaseOrderModule {}
