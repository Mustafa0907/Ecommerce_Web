import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { OrderItemComponent } from 'app/entities/order-item/order-item.component';
import { OrderItemService } from 'app/entities/order-item/order-item.service';
import { OrderItem } from 'app/shared/model/order-item.model';

describe('Component Tests', () => {
  describe('OrderItem Management Component', () => {
    let comp: OrderItemComponent;
    let fixture: ComponentFixture<OrderItemComponent>;
    let service: OrderItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [OrderItemComponent]
      })
        .overrideTemplate(OrderItemComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderItemComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderItemService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new OrderItem(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.orderItems && comp.orderItems[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
