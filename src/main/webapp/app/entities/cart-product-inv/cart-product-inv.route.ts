import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ICartProductInv, CartProductInv } from 'app/shared/model/cart-product-inv.model';
import { CartProductInvService } from './cart-product-inv.service';
import { CartProductInvComponent } from './cart-product-inv.component';
import { CartProductInvDetailComponent } from './cart-product-inv-detail.component';
import { CartProductInvUpdateComponent } from './cart-product-inv-update.component';
@Injectable({ providedIn: 'root' })
export class CartProductInvResolve implements Resolve<ICartProductInv> {
  constructor(private service: CartProductInvService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICartProductInv> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((cartProductInv: HttpResponse<CartProductInv>) => {
          if (cartProductInv.body) {
            return of(cartProductInv.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CartProductInv());
  }
}

export const cartProductInvRoute: Routes = [
  {
    path: '',
    component: CartProductInvComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'CartProductInvs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CartProductInvDetailComponent,
    resolve: {
      cartProductInv: CartProductInvResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'CartProductInvs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CartProductInvUpdateComponent,
    resolve: {
      cartProductInv: CartProductInvResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'CartProductInvs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CartProductInvUpdateComponent,
    resolve: {
      cartProductInv: CartProductInvResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'CartProductInvs'
    },
    canActivate: [UserRouteAccessService]
  }
];
