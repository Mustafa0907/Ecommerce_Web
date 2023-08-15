import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { CartProductInvDetailComponent } from 'app/entities/cart-product-inv/cart-product-inv-detail.component';
import { CartProductInv } from 'app/shared/model/cart-product-inv.model';

describe('Component Tests', () => {
  describe('CartProductInv Management Detail Component', () => {
    let comp: CartProductInvDetailComponent;
    let fixture: ComponentFixture<CartProductInvDetailComponent>;
    const route = ({ data: of({ cartProductInv: new CartProductInv(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [CartProductInvDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CartProductInvDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CartProductInvDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cartProductInv on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cartProductInv).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
