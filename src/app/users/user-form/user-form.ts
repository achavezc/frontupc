import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserFormComponent implements OnInit {
  userId: string | null = null;
  editing = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: [''],
      full_name: [''],
      profile_id: [null, Validators.required],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.editing = true;
      this.http.get<any[]>(`/admin/admin/users`).subscribe(users => {
        const user = users.find(u => u.id == +this.userId!);
        if (user) {
          this.form.patchValue({ ...user, password: '' });
        }
      });
    }
  }

  save() {
    const data = this.form.value;
    const req = this.editing
      ? this.http.put(`/admin/admin/users/${this.userId}`, data)
      : this.http.post(`/admin/admin/users`, data);

    req.subscribe(() => this.router.navigate(['/users']));
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
