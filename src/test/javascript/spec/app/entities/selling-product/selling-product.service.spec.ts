import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { SellingProductService } from 'app/entities/selling-product/selling-product.service';
import { ISellingProduct, SellingProduct } from 'app/shared/model/selling-product.model';

describe('Service Tests', () => {
  describe('SellingProduct Service', () => {
    let injector: TestBed;
    let service: SellingProductService;
    let httpMock: HttpTestingController;
    let elemDefault: ISellingProduct;
    let expectedResult: ISellingProduct | ISellingProduct[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(SellingProductService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new SellingProduct(0, currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 0);
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

      it('should create a SellingProduct', () => {
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

        service.create(new SellingProduct()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SellingProduct', () => {
        const returnedFromService = Object.assign(
          {
            createdondate: currentDate.format(DATE_TIME_FORMAT),
            name: 'BBBBBB',
            brand: 'BBBBBB',
            category: 'BBBBBB',
            details: 'BBBBBB',
            expectedPrice: 'BBBBBB',
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

      it('should return a list of SellingProduct', () => {
        const returnedFromService = Object.assign(
          {
            createdondate: currentDate.format(DATE_TIME_FORMAT),
            name: 'BBBBBB',
            brand: 'BBBBBB',
            category: 'BBBBBB',
            details: 'BBBBBB',
            expectedPrice: 'BBBBBB',
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

      it('should delete a SellingProduct', () => {
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
