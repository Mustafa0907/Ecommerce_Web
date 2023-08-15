import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPurchaseOrder, PurchaseOrder } from 'app/shared/model/purchase-order.model';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { PurchaseOrderUpdateComponent } from './purchase-order-update.component';
import { CheckoutPageComponent } from './checkout-page.component';
import { MyOrderComponent } from './my-order.component';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderResolve implements Resolve<IPurchaseOrder> {
  constructor(private service: PurchaseOrderService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchaseOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((purchaseOrder: HttpResponse<PurchaseOrder>) => {
          if (purchaseOrder.body) {
            return of(purchaseOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PurchaseOrder());
  }
}

export const purchaseOrderRoute: Routes = [
  
  {
    path: 'my-orders',
    component: MyOrderComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/checkout',
    component: CheckoutPageComponent,
    resolve: {
      purchaseOrder: PurchaseOrderResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: '',
    component: PurchaseOrderComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PurchaseOrderDetailComponent,
    resolve: {
      purchaseOrder: PurchaseOrderResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PurchaseOrderUpdateComponent,
    resolve: {
      purchaseOrder: PurchaseOrderResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PurchaseOrderUpdateComponent,
    resolve: {
      purchaseOrder: PurchaseOrderResolve
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'PurchaseOrders'
    },
    canActivate: [UserRouteAccessService]
  }
];
