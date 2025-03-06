import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatError,
    ReactiveFormsModule,
    MatError, CommonModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})

export class EditProductComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  product?: Product;
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  private router = inject(Router);
  file: File | null = null;
  fileError: string | null = null;

  ngOnInit(): void {
    this.loadProduct();
  }

  // onChange(event: any) {
  //   const fileData = event.target.files;
  //   if (fileData.length) {
  //     this.file = fileData;
  //     console.log(this.file);

  //   }
  // }


  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.shopService.getProduct(+id).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue(product); // ✅ Patch form values after fetching product
      },
      error: (error) => console.log(error),
    });
  }

  productForm = this.fb.group({
    id: [this.product?.id],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    file: [''],
    type: ['', Validators.required],
    brand: ['', Validators.required],
    quantityInStock: [1, [Validators.required, Validators.min(1)]]
  });

  onChange(event: any) {
    const file = event.target.files[0];

    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedExtensions.includes(fileExtension)) {
      this.fileError = 'Only JPG, JPEG, and PNG files are allowed.';
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'File size must be less than 2MB.';
      return;
    }

    this.file = file;
    this.fileError = null;
  }


  onSubmit() {
    // console.log(this.productForm.invalid);
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('file', this.file ?? "");

    // if (this.file) {
    //   formData.append('file', this.file);
    // }

    // Append form data
    Object.keys(this.productForm.controls).forEach((key) => {
      const value = this.productForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    console.log('FormData Entries:');
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]); // Debug FormData content
    }
    this.adminService.editProduct(this.product?.id, formData).subscribe({
      next: () => {
        console.log('Product Edit successfully');
        this.router.navigate(['/admin/product-table']); // Redirect after success
      },
      error: (err) => console.error('Error Editing product:', err)
    });
  }

}
