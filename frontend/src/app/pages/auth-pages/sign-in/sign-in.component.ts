import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [AuthPageLayoutComponent, SigninFormComponent],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent {
  errorMsg: string | null = null;
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) { }

  onLogin(dto: { email: string; password: string; remember: boolean }) {
    this.errorMsg = null;

    const email = dto.email?.trim() || '';
    const password = dto.password?.trim() || '';

    if (!email && !password) {
      this.errorMsg = 'Debes ingresar el correo y la contraseña.';
      return;
    }

    if (!email) {
      this.errorMsg = 'Debes ingresar el correo.';
      return;
    }

    if (!password) {
      this.errorMsg = 'Debes ingresar la contraseña.';
      return;
    }

    this.isLoading = true;

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/app']);
      },
      error: (err: any) => {
        this.isLoading = false;
        const status = err?.status;

        if (status === 401) {
          this.errorMsg = 'El correo o la contraseña son incorrectos. Verifica tus datos e intenta de nuevo.';
        } else if (status === 403 || status === 423) {
          this.errorMsg = 'Tu cuenta está bloqueada. Contacta al administrador.';
        } else if (status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else {
          this.errorMsg = 'el email no es un correo valido o no existe, verifica tus datos e intenta de nuevo.';
        }
      },
    });
  }
}