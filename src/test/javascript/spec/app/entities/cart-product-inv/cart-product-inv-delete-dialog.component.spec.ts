import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { MockEventManager } from '../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../helpers/mock-active-modal.service';
import { CartProductInvDeleteDialogComponent } from 'app/entities/cart-product-inv/cart-product-inv-delete-dialog.component';
import { CartProductInvService } from 'app/entities/cart-product-inv/cart-product-inv.service';

describe('Component Tests', () => {
  describe('CartProductInv Management Delete Component', () => {
    let comp: CartProductInvDeleteDialogComponent;
    let fixture: ComponentFixture<CartProductInvDeleteDialogComponent>;
    let service: CartProductInvService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [CartProductInvDeleteDialogComponent]
      })
        .overrideTemplate(CartProductInvDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CartProductInvDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CartProductInvService);
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
