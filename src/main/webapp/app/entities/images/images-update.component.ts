import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IImages, Images } from 'app/shared/model/images.model';
import { ImagesService } from './images.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';

@Component({
  selector: 'jhi-images-update',
  templateUrl: './images-update.component.html'
})
export class ImagesUpdateComponent implements OnInit {
  isSaving = false;
  products: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    imagePath: [],
    product: []
  });

  constructor(
    protected imagesService: ImagesService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ images }) => {
      this.updateForm(images);

      this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => (this.products = res.body || []));
    });
  }

  updateForm(images: IImages): void {
    this.editForm.patchValue({
      id: images.id,
      imagePath: images.imagePath,
      product: images.product
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const images = this.createFromForm();
    if (images.id !== undefined) {
      this.subscribeToSaveResponse(this.imagesService.update(images));
    } else {
      this.subscribeToSaveResponse(this.imagesService.create(images));
    }
  }

  private createFromForm(): IImages {
    return {
      ...new Images(),
      id: this.editForm.get(['id'])!.value,
      imagePath: this.editForm.get(['imagePath'])!.value,
      product: this.editForm.get(['product'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImages>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IProduct): any {
    return item.id;
  }
}
