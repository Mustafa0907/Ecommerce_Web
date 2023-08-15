import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingCartDetailComponent } from './shopping-cart-detail.component';
import { ShoppingCartUpdateComponent } from './shopping-cart-update.component';
import { ShoppingCartDeleteDialogComponent } from './shopping-cart-delete-dialog.component';
import { shoppingCartRoute } from './shopping-cart.route';

@NgModule({
  imports: [EcommerceWebAppSharedModule, RouterModule.forChild(shoppingCartRoute)],
  declarations: [ShoppingCartComponent, ShoppingCartDetailComponent, ShoppingCartUpdateComponent, ShoppingCartDeleteDialogComponent],
  entryComponents: [ShoppingCartDeleteDialogComponent]
})
export class EcommerceWebAppShoppingCartModule {}
