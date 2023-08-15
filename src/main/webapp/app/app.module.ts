import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { EcommerceWebAppSharedModule } from 'app/shared/shared.module';
import { EcommerceWebAppCoreModule } from 'app/core/core.module';
import { EcommerceWebAppAppRoutingModule } from './app-routing.module';
import { EcommerceWebAppHomeModule } from './home/home.module';
import { EcommerceWebAppEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

import { NgZorroAntdModule, NzPaginationModule, NzTabsModule} from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { CommonModule } from '@angular/common';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

// import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    // ... other imports
    NzButtonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzFormModule,
    NgZorroAntdModule,
    NzCarouselModule,
    DemoNgZorroAntdModule,
    CommonModule,
    BrowserModule,
    NzTabsModule,
    NzCollapseModule,
    NzPaginationModule
    
  ],
  // ... other configurations
})
export class AppModule { }


@NgModule({
  imports: [
    BrowserModule,
    EcommerceWebAppSharedModule,
    EcommerceWebAppCoreModule,
    EcommerceWebAppHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EcommerceWebAppEntityModule,
    EcommerceWebAppAppRoutingModule,
    NgZorroAntdModule,
    NzButtonModule,
    NzCarouselModule,
    DemoNgZorroAntdModule,
    CommonModule,
    BrowserAnimationsModule,
    NzTabsModule,
    NzCollapseModule,
    NzPaginationModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent]
})
export class EcommerceWebAppAppModule {}
