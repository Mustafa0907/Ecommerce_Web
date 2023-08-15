import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { CartProductInvComponent } from 'app/entities/cart-product-inv/cart-product-inv.component';
import { CartProductInvService } from 'app/entities/cart-product-inv/cart-product-inv.service';
import { CartProductInv } from 'app/shared/model/cart-product-inv.model';

describe('Component Tests', () => {
  describe('CartProductInv Management Component', () => {
    let comp: CartProductInvComponent;
    let fixture: ComponentFixture<CartProductInvComponent>;
    let service: CartProductInvService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [CartProductInvComponent]
      })
        .overrideTemplate(CartProductInvComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CartProductInvComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CartProductInvService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CartProductInv(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.cartProductInvs && comp.cartProductInvs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
