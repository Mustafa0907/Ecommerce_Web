import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EcommerceWebAppTestModule } from '../../../test.module';
import { ImagesComponent } from 'app/entities/images/images.component';
import { ImagesService } from 'app/entities/images/images.service';
import { Images } from 'app/shared/model/images.model';

describe('Component Tests', () => {
  describe('Images Management Component', () => {
    let comp: ImagesComponent;
    let fixture: ComponentFixture<ImagesComponent>;
    let service: ImagesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcommerceWebAppTestModule],
        declarations: [ImagesComponent]
      })
        .overrideTemplate(ImagesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ImagesComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ImagesService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Images(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.images && comp.images[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
