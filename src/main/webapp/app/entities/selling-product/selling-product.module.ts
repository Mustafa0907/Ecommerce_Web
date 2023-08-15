import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { SellingProductComponent } from './selling-product.component';
import { SellingProductDetailComponent } from './selling-product-detail.component';
import { SellingProductUpdateComponent } from './selling-product-update.component';
import { SellingProductDeleteDialogComponent } from './selling-product-delete-dialog.component';
import { sellingProductRoute } from './selling-product.route';

@NgModule({
  imports: [EcommerceWebAppSharedModule, RouterModule.forChild(sellingProductRoute)],
  declarations: [
    SellingProductComponent,
    SellingProductDetailComponent,
    SellingProductUpdateComponent,
    SellingProductDeleteDialogComponent
  ],
  entryComponents: [SellingProductDeleteDialogComponent]
})
export class EcommerceWebAppSellingProductModule {}
