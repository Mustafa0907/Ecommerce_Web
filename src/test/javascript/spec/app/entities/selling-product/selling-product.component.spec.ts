import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { SellingProductComponent } from 'app/entities/selling-product/selling-product.component';
import { SellingProductService } from 'app/entities/selling-product/selling-product.service';
import { SellingProduct } from 'app/shared/model/selling-product.model';

describe('Component Tests', () => {
  describe('SellingProduct Management Component', () => {
    let comp: SellingProductComponent;
    let fixture: ComponentFixture<SellingProductComponent>;
    let service: SellingProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [SellingProductComponent]
      })
        .overrideTemplate(SellingProductComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SellingProductComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(SellingProductService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new SellingProduct(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.sellingProducts && comp.sellingProducts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
