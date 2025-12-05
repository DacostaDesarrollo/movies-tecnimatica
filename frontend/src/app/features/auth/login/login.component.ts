import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbLayoutModule } from '@nebular/theme';
import { LoginRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NbLayoutModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAlertModule,
    NbIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Validador personalizado de email más estricto
  private emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    // Patrón más estricto que requiere dominio completo (ej: .com, .es, .net)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { email: true };
    }

    return null;
  }

  public loginForm: FormGroup = this.fb.group({
      email: ['', [Validators.required, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  public loading:boolean = false;
  public errorMessage:string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ){}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const loginData: LoginRequest = { email, password };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/pages/search']);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else if (error.status === 0) {
          this.errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        }

        console.error('Error en login:', error);
      }
    });
  }
}
