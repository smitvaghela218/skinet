import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
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

  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  file: File | null = null;
  fileError: string | null = null;



  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0.01)]], // Price must be > 0
    // pictureUrl: ['', Validators.required], // Required       
    file: ['', Validators.required],
    type: ['', Validators.required], // Required
    brand: ['', Validators.required], // Required
    quantityInStock: [1, [Validators.required, Validators.min(1)]] // At least 1
  });

  validateFile() {
    if (!this.file) {
      this.fileError = 'Image is required.';
    }
  }

  // Handle file selection and validation
  onChange(event: any) {
    const file = event.target.files[0];

    if (!file) {
      this.fileError = 'Image is required.';
      this.productForm.controls['file'].setValue(null);
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedExtensions.includes(fileExtension)) {
      this.fileError = 'Only JPG, JPEG, and PNG files are allowed.';
      this.productForm.controls['file'].setValue(null);
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'File size must be less than 2MB.';
      this.productForm.controls['file'].setValue(null);
      return;
    }

    this.file = file;
    this.fileError = null;
    this.productForm.controls['file'].setValue(file); // Manually set file in FormControl
  }

  onSubmit() {
    // console.log("this.productForm.valid " + this.productForm.valid);
    // console.log("this.file " + this.file);

    if (!this.productForm.valid || !this.file) {
      alert('Please fill all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file); // Append the file

    // Append form values
    Object.keys(this.productForm.controls).forEach((key) => {
      formData.append(key, this.productForm.get(key)?.value as string);
    });

    console.log('FormData Entries:');
    for (const pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]); // Debug FormData content
    }


    this.adminService.addProduct(formData).subscribe({
      next: () => {
        // console.log('Product added successfully');
        this.router.navigate(['/admin/product-table']);
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }


}
