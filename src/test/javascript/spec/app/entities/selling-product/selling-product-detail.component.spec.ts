import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { SellingProductDetailComponent } from 'app/entities/selling-product/selling-product-detail.component';
import { SellingProduct } from 'app/shared/model/selling-product.model';

describe('Component Tests', () => {
  describe('SellingProduct Management Detail Component', () => {
    let comp: SellingProductDetailComponent;
    let fixture: ComponentFixture<SellingProductDetailComponent>;
    const route = ({ data: of({ sellingProduct: new SellingProduct(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [SellingProductDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(SellingProductDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SellingProductDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load sellingProduct on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.sellingProduct).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
