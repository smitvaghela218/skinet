import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatError,
    ReactiveFormsModule,
    MatError, MatRadioModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);
  validationErrors?: string[];

  userForm = this.fb.group({
    firstName: ['', Validators.required],  // Matches AdminCreateUserDto
    lastName: ['', Validators.required],   // Matches AdminCreateUserDto
    email: ['', [Validators.required, Validators.email]], // Matches AdminCreateUserDto
    password: ['', Validators.required],   // Matches AdminCreateUserDto
    role: ['Customer', Validators.required] // Default role as "Customer"
  });

  onSubmit() {
    if (this.userForm.invalid) return;
    console.log(this.userForm.value);

    this.adminService.addUser(this.userForm.value).subscribe({
      next: () => {
        console.log('user added successfully');
        this.router.navigate(['/admin/user-table']); // Redirect after success
        console.log('user redirect successfully');

      },
      error: (err) => {
        console.error('Error adding user:', err),
          this.validationErrors = err
      }
    });
  }

}

// <mat-radio-group aria-label="Select an option">
//   <mat-radio-button value="1">Option 1</mat-radio-button>
//   <mat-radio-button value="2">Option 2</mat-radio-button>
// </mat-radio-group>
