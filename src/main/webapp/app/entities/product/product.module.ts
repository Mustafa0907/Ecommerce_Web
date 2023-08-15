import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductUpdateComponent } from './product-update.component';
import { ProductDeleteDialogComponent } from './product-delete-dialog.component';
import { productRoute } from './product.route';
import { LandingPageComponent } from './landing-page.component';
import { ViewCartComponent } from './view-cart.component';
import { ProductDetComponent } from './product-det.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [EcommerceWebAppSharedModule, RouterModule.forChild(productRoute), CommonModule],
  declarations: [ProductComponent, ProductDetailComponent, ProductUpdateComponent, ProductDeleteDialogComponent, LandingPageComponent, ViewCartComponent,ProductDetComponent],
  entryComponents: [ProductDeleteDialogComponent]
})
export class EcommerceWebAppProductModule {}
