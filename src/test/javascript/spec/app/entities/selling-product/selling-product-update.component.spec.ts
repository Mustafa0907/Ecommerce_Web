import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { SellingProductUpdateComponent } from 'app/entities/selling-product/selling-product-update.component';
import { SellingProductService } from 'app/entities/selling-product/selling-product.service';
import { SellingProduct } from 'app/shared/model/selling-product.model';

describe('Component Tests', () => {
  describe('SellingProduct Management Update Component', () => {
    let comp: SellingProductUpdateComponent;
    let fixture: ComponentFixture<SellingProductUpdateComponent>;
    let service: SellingProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [SellingProductUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(SellingProductUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SellingProductUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SellingProductService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new SellingProduct(123);
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
        const entity = new SellingProduct();
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
