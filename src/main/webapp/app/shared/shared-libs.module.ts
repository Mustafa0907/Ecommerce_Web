import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { DemoNgZorroAntdModule } from 'app/ng-zorro-antd.module';
// import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  exports: [DemoNgZorroAntdModule,NgZorroAntdModule, FormsModule, CommonModule, NgbModule, NgJhipsterModule, InfiniteScrollModule, FontAwesomeModule, ReactiveFormsModule]
})
export class EcommerceWebAppSharedLibsModule {}
