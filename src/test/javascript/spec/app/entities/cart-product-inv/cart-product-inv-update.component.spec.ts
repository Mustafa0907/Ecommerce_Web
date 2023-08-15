import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { CartProductInvUpdateComponent } from 'app/entities/cart-product-inv/cart-product-inv-update.component';
import { CartProductInvService } from 'app/entities/cart-product-inv/cart-product-inv.service';
import { CartProductInv } from 'app/shared/model/cart-product-inv.model';

describe('Component Tests', () => {
  describe('CartProductInv Management Update Component', () => {
    let comp: CartProductInvUpdateComponent;
    let fixture: ComponentFixture<CartProductInvUpdateComponent>;
    let service: CartProductInvService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [CartProductInvUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CartProductInvUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CartProductInvUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CartProductInvService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CartProductInv(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new CartProductInv();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
