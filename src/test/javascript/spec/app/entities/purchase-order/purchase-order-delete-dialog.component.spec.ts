import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { MockEventManager } from '../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../helpers/mock-active-modal.service';
import { PurchaseOrderDeleteDialogComponent } from 'app/entities/purchase-order/purchase-order-delete-dialog.component';
import { PurchaseOrderService } from 'app/entities/purchase-order/purchase-order.service';

describe('Component Tests', () => {
  describe('PurchaseOrder Management Delete Component', () => {
    let comp: PurchaseOrderDeleteDialogComponent;
    let fixture: ComponentFixture<PurchaseOrderDeleteDialogComponent>;
    let service: PurchaseOrderService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [PurchaseOrderDeleteDialogComponent]
      })
        .overrideTemplate(PurchaseOrderDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PurchaseOrderDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PurchaseOrderService);
      mockEventManager = TestBed.get(JhiEventManager);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.closeSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
      });
    });
  });
});
