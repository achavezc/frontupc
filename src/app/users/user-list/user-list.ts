import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Profile {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  profile_id: number;
  profile: Profile;
}

interface Profile {
  id: number;
  name: string;
}

interface CreateUserDto {
  email: string;
  full_name: string;
  password: string;
  profile_id: number | null;
  is_active: boolean;
}

interface EditUserDto {
  full_name: string;
  profile_id: number | null;
  is_active: boolean;
}

@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  profiles: Profile[] = [];
  errorMessages: string[] = [];
  showSuccess = false;

  newUserData: CreateUserDto = {
    email: '',
    full_name: '',
    password: '',
    profile_id: null,
    is_active: true
  };

  isEditMode = false;
  editingUserId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProfiles();
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:8000/admin/users?skip=0&limit=100')
      .subscribe(res => this.users = res);
  }

  loadProfiles() {
    this.http.get<Profile[]>('http://localhost:8000/admin/profiles?skip=0&limit=100')
      .subscribe(res => this.profiles = res);
  }

  deleteUser(id: number) {
    if (confirm('¿Eliminar usuario?')) {
      this.http.delete(`http://localhost:8000/admin/users/${id}`)
        .subscribe(() => this.loadUsers());
    }
  }

  newUser() {
    this.isEditMode = false;
    this.resetForm();
    this.errorMessages = [];
    this.openModal();
  }

  editUser(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) return;

    this.isEditMode = true;
    this.editingUserId = id;
    this.newUserData = {
      email: user.email,
      full_name: user.full_name,
      password: '',
      profile_id: user.profile_id,
      is_active: user.is_active
    };

    this.errorMessages = [];
    this.openModal();
  }

  submitUser() {
    this.errorMessages = [];

    if (!this.isEditMode) {
      this.errorMessages = this.validatePassword(this.newUserData.password);
      if (this.errorMessages.length > 0) return;
    }

    if (this.isEditMode && this.editingUserId !== null) {
      const payload: EditUserDto = {
        full_name: this.newUserData.full_name,
        profile_id: this.newUserData.profile_id,
        is_active: this.newUserData.is_active
      };

      this.http.put(`http://localhost:8000/admin/users/${this.editingUserId}`, payload).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
          alert('Usuario actualizado correctamente.');
        },
        error: err => {
          this.handleApiError(err);
        }
      });
    } else {
      this.http.post('http://localhost:8000/admin/users', this.newUserData).subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
          alert('Usuario registrado correctamente.');
        },
        error: err => {
          this.handleApiError(err);
        }
      });
    }
  }

  resetForm() {
    this.newUserData = {
      email: '',
      full_name: '',
      password: '',
      profile_id: null,
      is_active: true
    };
  }

  validatePassword(password: string): string[] {
    const errors: string[] = [];
    if (password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Debe contener al menos una letra mayúscula');
    if (!/[a-z]/.test(password)) errors.push('Debe contener al menos una letra minúscula');
    if (!/\d/.test(password)) errors.push('Debe contener al menos un número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Debe contener al menos un carácter especial');
    if (/\s/.test(password)) errors.push('No debe contener espacios');
    return errors;
  }

  handleApiError(err: any) {
    if (err.error?.detail && Array.isArray(err.error.detail)) {
      this.errorMessages = err.error.detail.map((e: any) => e.msg);
    } else {
      this.errorMessages = ['Ocurrió un error inesperado.'];
    }
  }

  openModal() {
    const modalEl = document.getElementById('newUserModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('newUserModal'));
    modal?.hide();
  }
}
