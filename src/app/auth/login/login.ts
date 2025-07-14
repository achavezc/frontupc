import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  form!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Botón presionado');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Formulario inválido:', this.form.value);
      return;
    }

    this.http.post('http://localhost:8000/auth/login', this.form.value).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('access_token', response.access_token);
        //this.router.navigate(['/dashboard']);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas';
        console.error(err);
      }
    });
  }
}
