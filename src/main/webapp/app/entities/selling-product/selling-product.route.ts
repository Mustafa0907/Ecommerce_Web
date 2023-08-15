import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISellingProduct, SellingProduct } from 'app/shared/model/selling-product.model';
import { SellingProductService } from './selling-product.service';
import { SellingProductComponent } from './selling-product.component';
import { SellingProductDetailComponent } from './selling-product-detail.component';
import { SellingProductUpdateComponent } from './selling-product-update.component';

@Injectable({ providedIn: 'root' })
export class SellingProductResolve implements Resolve<ISellingProduct> {
  constructor(private service: SellingProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISellingProduct> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((sellingProduct: HttpResponse<SellingProduct>) => {
          if (sellingProduct.body) {
            return of(sellingProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SellingProduct());
  }
}

export const sellingProductRoute: Routes = [
  
  {
    path: '',
    component: SellingProductComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'SellingProducts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: SellingProductDetailComponent,
    resolve: {
      sellingProduct: SellingProductResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'SellingProducts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: SellingProductUpdateComponent,
    resolve: {
      sellingProduct: SellingProductResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'SellingProducts'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: SellingProductUpdateComponent,
    resolve: {
      sellingProduct: SellingProductResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'SellingProducts'
    },
    canActivate: [UserRouteAccessService]
  }
];
