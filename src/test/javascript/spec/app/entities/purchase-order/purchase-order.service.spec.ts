import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PurchaseOrderService } from 'app/entities/purchase-order/purchase-order.service';
import { IPurchaseOrder, PurchaseOrder } from 'app/shared/model/purchase-order.model';

describe('Service Tests', () => {
  describe('PurchaseOrder Service', () => {
    let injector: TestBed;
    let service: PurchaseOrderService;
    let httpMock: HttpTestingController;
    let elemDefault: IPurchaseOrder;
    let expectedResult: IPurchaseOrder | IPurchaseOrder[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(PurchaseOrderService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new PurchaseOrder(0, currentDate, 'AAAAAAA', 0, 'AAAAAAA', 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdondate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PurchaseOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdondate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdondate: currentDate
          },
          returnedFromService
        );

        service.create(new PurchaseOrder()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PurchaseOrder', () => {
        const returnedFromService = Object.assign(
          {
            createdondate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            total: 1,
            paymentMethod: 'BBBBBB',
            userid: 1
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdondate: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PurchaseOrder', () => {
        const returnedFromService = Object.assign(
          {
            createdondate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB',
            total: 1,
            paymentMethod: 'BBBBBB',
            userid: 1
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdondate: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PurchaseOrder', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
