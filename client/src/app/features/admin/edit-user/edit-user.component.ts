import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { MatRadioModule } from '@angular/material/radio';
import { User } from '../../../shared/models/user';


@Component({
  selector: 'app-edit-user',
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
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  user?: User;
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  validationErrors?: string[];

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;

    this.adminService.getUser(id).subscribe({
      next: (user) => {
        // console.log(user);
        this.user = user;

        this.userForm.patchValue({
          ...user,
          roles: user.roles // Since roles is already a string, assign it directly
        });
      },
      error: (error) => console.log(error),
    });
  }


  userForm = this.fb.group({
    id: [''],
    firstName: ['', Validators.required],  // Matches AdminCreateUserDto
    lastName: ['', Validators.required],   // Matches AdminCreateUserDto
    email: ['', [Validators.required, Validators.email]], // Matches AdminCreateUserDto
    roles: ['Customer', Validators.required] // Default role as "Customer"
  });


  onSubmit() {
    if (this.userForm.invalid) return;
    // console.log(this.userForm.value);

    this.adminService.editUser(this.user?.id, this.userForm.value).subscribe({
      next: () => {
        console.log('user update successfully');
        this.router.navigate(['/admin/user-table']); // Redirect after success
      },
      error: (err) => {
        console.error('Error editing user:', err)
        // this.validationErrors = err
      }
    });
  }

}
