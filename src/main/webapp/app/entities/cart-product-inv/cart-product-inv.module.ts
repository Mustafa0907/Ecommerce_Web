import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { CartProductInvComponent } from './cart-product-inv.component';
import { CartProductInvDetailComponent } from './cart-product-inv-detail.component';
import { CartProductInvUpdateComponent } from './cart-product-inv-update.component';
import { CartProductInvDeleteDialogComponent } from './cart-product-inv-delete-dialog.component';
import { cartProductInvRoute } from './cart-product-inv.route';

@NgModule({
  imports: [EcommerceWebAppSharedModule, RouterModule.forChild(cartProductInvRoute)],
  declarations: [
    CartProductInvComponent,
    CartProductInvDetailComponent,
    CartProductInvUpdateComponent,
    CartProductInvDeleteDialogComponent
  ],
  entryComponents: [CartProductInvDeleteDialogComponent]
})
export class EcommerceWebAppCartProductInvModule {}
